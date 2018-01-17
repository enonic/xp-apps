package com.enonic.xp.app.users.lib.auth;

import java.util.List;
import java.util.Objects;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import com.enonic.xp.script.ScriptValue;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.security.AuthConfig;
import com.enonic.xp.security.CreateUserStoreParams;
import com.enonic.xp.security.PrincipalKey;
import com.enonic.xp.security.SecurityService;
import com.enonic.xp.security.UserStore;
import com.enonic.xp.security.UserStoreKey;
import com.enonic.xp.security.acl.UserStoreAccess;
import com.enonic.xp.security.acl.UserStoreAccessControlEntry;
import com.enonic.xp.security.acl.UserStoreAccessControlList;

public final class CreateUserStoreHandler
    implements ScriptBean
{
    private String name;

    private String displayName;

    private String description;

    private AuthConfig authConfig;

    private UserStoreAccessControlList permissions;

    private Supplier<SecurityService> securityService;

    public void setName( final String name )
    {
        this.name = name;
    }

    public void setDisplayName( final String displayName )
    {
        this.displayName = displayName;
    }

    public void setDescription( final String description )
    {
        this.description = description;
    }

    public void setAuthConfig( final ScriptValue authConfig )
    {
        this.authConfig = authConfig == null ? null : ScriptValueToAuthConfigTranslator.translate( authConfig );
    }

    public void setPermissions( final ScriptValue permissions )
    {
        this.permissions = createPermissions( permissions );
    }

    public UserStoreMapper createUserStore()
    {
        final String displayName = this.displayName == null ? this.name : this.displayName;
        final CreateUserStoreParams params = CreateUserStoreParams.create().
            key( UserStoreKey.from( name ) ).
            displayName( displayName ).
            description( description ).
            authConfig( authConfig ).
            permissions( permissions ).
            build();
        final UserStore userStore = securityService.get().createUserStore( params );
        return userStore == null ? null : new UserStoreMapper( userStore );
    }

    private UserStoreAccessControlList createPermissions( final ScriptValue permissions )
    {
        if ( permissions != null )
        {
            final List<UserStoreAccessControlEntry> entries = permissions.getArray().stream().
                map( this::createAccessControlEntry ).
                filter( Objects::nonNull ).
                collect( Collectors.toList() );
            return UserStoreAccessControlList.create().addAll( entries ).build();
        }

        return null;
    }

    private UserStoreAccessControlEntry createAccessControlEntry( ScriptValue scriptValue )
    {
        final String principalValue =
            scriptValue.hasMember( "principal" ) ? scriptValue.getMember( "principal" ).getValue().toString() : null;
        final String accessValue = scriptValue.hasMember( "access" ) ? scriptValue.getMember( "access" ).getValue().toString() : null;

        final PrincipalKey principalKey = principalValue == null ? null : PrincipalKey.from( principalValue );
        final UserStoreAccess access = UserStoreAccess.valueOf( accessValue );

        final boolean hasPrincipal = principalValue != null && securityService.get().getPrincipal( principalKey ).isPresent();

        return hasPrincipal ? UserStoreAccessControlEntry.create().principal( principalKey ).access( access ).build() : null;
    }

    @Override
    public void initialize( final BeanContext context )
    {
        securityService = context.getService( SecurityService.class );
    }
}
