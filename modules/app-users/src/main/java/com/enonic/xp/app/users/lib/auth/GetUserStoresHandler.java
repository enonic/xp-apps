package com.enonic.xp.app.users.lib.auth;

import java.util.List;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.security.SecurityService;
import com.enonic.xp.security.UserStores;

public final class GetUserStoresHandler
    implements ScriptBean
{
    private Supplier<SecurityService> securityService;

    public List<UserStoreMapper> getUserStores()
    {
        final UserStores userStores = securityService.get().getUserStores();
        return userStores.stream().
            map( userStore -> new UserStoreMapper( userStore ) ).
            collect( Collectors.toList() );
    }

    @Override
    public void initialize( final BeanContext context )
    {
        securityService = context.getService( SecurityService.class );
    }
}