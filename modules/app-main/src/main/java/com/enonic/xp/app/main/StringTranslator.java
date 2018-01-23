package com.enonic.xp.app.main;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import com.enonic.xp.app.ApplicationKey;
import com.enonic.xp.i18n.LocaleService;
import com.enonic.xp.i18n.MessageBundle;
import com.enonic.xp.web.servlet.ServletRequestHolder;

public final class StringTranslator
{
    private LocaleService localeService;

    public StringTranslator( final LocaleService localeService )
    {
        this.localeService = localeService;
    }

    public String localize( final ApplicationKey applicationKey, final String key, final String defaultValue )
    {
        final MessageBundle bundle = this.localeService.getBundle( applicationKey, new Locale( getLocale() ) );

        if ( bundle == null )
        {
            return defaultValue;
        }
        final String localizedValue = bundle.localize( key );
        return localizedValue != null ? localizedValue : defaultValue;
    }

    private String getLocale()
    {
        final HttpServletRequest req = ServletRequestHolder.getRequest();
        final Locale locale = req != null ? req.getLocale() : Locale.getDefault();
        if ( locale == null )
        {
            return "";
        }
        return resolveLanguage( locale.getLanguage().toLowerCase() );
    }

    private String resolveLanguage( final String lang )
    {
        if ( lang.equals( "nn" ) )
        {
            return "no";
        }

        if ( lang.equals( "nb" ) )
        {
            return "no";
        }

        return lang;
    }
}
