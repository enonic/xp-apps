package com.enonic.xp.app.users.lib.auth;

import java.util.List;

import com.enonic.xp.app.ApplicationKey;
import com.enonic.xp.data.Property;
import com.enonic.xp.data.PropertyArray;
import com.enonic.xp.data.PropertySet;
import com.enonic.xp.data.PropertyTree;
import com.enonic.xp.data.Value;
import com.enonic.xp.data.ValueFactory;
import com.enonic.xp.data.ValueType;
import com.enonic.xp.data.ValueTypes;
import com.enonic.xp.script.ScriptValue;
import com.enonic.xp.security.AuthConfig;

public final class ScriptValueToAuthConfigTranslator
{
    public static AuthConfig translate( final ScriptValue value )
    {
        final ApplicationKey key =
            value.hasMember( "applicationKey" ) ? ApplicationKey.from( value.getMember( "applicationKey" ).getValue().toString() ) : null;
        final PropertyTree config = value.hasMember( "config" ) ? mapConfig( value.getMember( "config" ).getArray() ) : null;
        return AuthConfig.create().
            applicationKey( key ).
            config( config ).
            build();
    }

    private static PropertyTree mapConfig( final List<ScriptValue> config )
    {
        final PropertyTree tree = new PropertyTree();
        for ( ScriptValue propertyArray : config )
        {
            addPropertyArray( propertyArray, tree.getRoot() );
        }
        return tree;
    }

    private static void addPropertyArray( final ScriptValue array, final PropertySet parent )
    {
        final String name = array.getMember( "name" ).getValue( String.class );
        final ValueType type = ValueTypes.getByName( array.getMember( "type" ).getValue( String.class ) );
        final List<ScriptValue> values = array.getMember( "values" ).getArray();

        for ( final ScriptValue value : values )
        {
            addPropertyValue( value, type, name, parent );
        }
    }

    private static void addPropertyValue( final ScriptValue propertyValue, final ValueType type, final String name, PropertySet parent )
    {
        final Value value;
        if ( type.equals( ValueTypes.PROPERTY_SET ) )
        {
            if ( propertyValue.hasMember( "set" ) )
            {
                final PropertySet newSet = parent.newSet();
                for ( ScriptValue propertyArray : propertyValue.getMember( "set" ).getArray() )
                {
                    
                    addPropertyArray( propertyArray, newSet );
                }
                value = ValueFactory.newPropertySet( newSet );
            }
            else
            {
                value = ValueFactory.newPropertySet( null );
            }
        }
        else
        {
            value = type.fromJsonValue( propertyValue.getMember( "v" ).getValue() );
        }        
        parent.addProperty( name, value );
    }
}
