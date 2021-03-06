package com.enonic.xp.app.users.lib.auth;

import com.enonic.xp.lib.common.PrincipalMapper;
import com.enonic.xp.script.serializer.MapGenerator;
import com.enonic.xp.script.serializer.MapSerializable;
import com.enonic.xp.security.Principal;
import com.enonic.xp.security.acl.UserStoreAccess;

public class UserStoreAccessControlEntryMapper
    implements MapSerializable
{
    private final Principal principal;

    private final UserStoreAccess access;

    public UserStoreAccessControlEntryMapper( final Principal principal, final UserStoreAccess access )
    {
        this.principal = principal;
        this.access = access;
    }


    private void serialize( final MapGenerator gen, final Principal principal, final UserStoreAccess access )
    {
        serializePrincipal( gen, principal );
        gen.value( "access", access.toString() );
    }

    private void serializePrincipal( final MapGenerator gen, final Principal principal )
    {
        gen.map( "principal" );
        new PrincipalMapper( principal ).serialize( gen );
        gen.end();
    }

    @Override
    public void serialize( final MapGenerator gen )
    {
        serialize( gen, this.principal, this.access );
    }
}
