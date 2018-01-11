package com.enonic.xp.app.users.lib.auth;

import java.util.function.Supplier;

import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.security.SecurityService;
import com.enonic.xp.security.UserStore;
import com.enonic.xp.security.UserStoreKey;

public final class GetUserStoreHandler
    implements ScriptBean
{
    private UserStoreKey userStoreKey;

    private Supplier<SecurityService> securityService;

    public void setUserStoreKey( final String userStoreKey )
    {
        this.userStoreKey = UserStoreKey.from( userStoreKey );
    }

    public UserStoreMapper getUserStore()
    {
        final UserStore userStore = securityService.get().getUserStore( userStoreKey );
        return userStore == null ? null : new UserStoreMapper( userStore );
    }

    @Override
    public void initialize( final BeanContext context )
    {
        securityService = context.getService( SecurityService.class );
    }
}