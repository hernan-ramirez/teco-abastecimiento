using System;
using System.Runtime.InteropServices;
using System.Security.Permissions;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;

namespace AB.Branding.Features.Branding
{
    /// <summary>
    /// This class handles events raised during feature activation, deactivation, installation, uninstallation, and upgrade.
    /// </summary>
    /// <remarks>
    /// The GUID attached to this class may be used during packaging and should not be modified.
    /// </remarks>

    [Guid("c0c9a5df-05e1-47cb-abf4-4dfdd2842226")]
    public class BrandingEventReceiver : SPFeatureReceiver
    {

        public override void FeatureActivated(SPFeatureReceiverProperties properties)
        {
            SPWeb Web = properties.Feature.Parent as SPWeb;

            Web.MasterUrl = Web.Site.RootWeb.ServerRelativeUrl + "/_catalogs/masterpage/Abastecimiento2013.master";
            Web.CustomMasterUrl = Web.Site.RootWeb.ServerRelativeUrl + "/_catalogs/masterpage/Abastecimiento2013.master";
            Web.SiteLogoUrl = Web.Site.RootWeb.ServerRelativeUrl + "/Style%20Library/Abastecimiento/img/Logos/SiteLogo.png";
            Web.Update();

            SPFile colorPaletteFile = Web.GetFile(Web.Site.RootWeb.ServerRelativeUrl + "/_catalogs/theme/15/Abastecimiento2013.spcolor");
            if (null == colorPaletteFile || !colorPaletteFile.Exists) { throw new Exception("colorPaletteFile"); }

            SPFile fontSchemeFile = Web.GetFile(Web.Site.RootWeb.ServerRelativeUrl + "/_catalogs/theme/15/SharePointPersonality.spfont");
            if (null == fontSchemeFile || !fontSchemeFile.Exists) { throw new Exception("fontSchemeFile"); }

            SPTheme theme = SPTheme.Open("Abastecimiento2013", colorPaletteFile, fontSchemeFile);
            theme.ApplyTo(Web, true);
        }

        public override void FeatureDeactivating(SPFeatureReceiverProperties properties)
        {
            SPWeb Web = properties.Feature.Parent as SPWeb;

            Web.MasterUrl = Web.Site.RootWeb.ServerRelativeUrl + "/_catalogs/masterpage/seattle.master";
            Web.CustomMasterUrl = Web.Site.RootWeb.ServerRelativeUrl + "/_catalogs/masterpage/seattle.master";
            Web.SiteLogoUrl = "";
            Web.Update();

            SPFile colorPaletteFile = Web.GetFile(Web.Site.RootWeb.ServerRelativeUrl + "/_catalogs/theme/15/Palette001.spcolor");
            if (null == colorPaletteFile || !colorPaletteFile.Exists) { throw new Exception("colorPaletteFile"); }

            SPFile fontSchemeFile = Web.GetFile(Web.Site.RootWeb.ServerRelativeUrl + "/_catalogs/theme/15/SharePointPersonality.spfont");
            if (null == fontSchemeFile || !fontSchemeFile.Exists) { throw new Exception("fontSchemeFile"); }

            SPTheme theme = SPTheme.Open("SharePointDefault", colorPaletteFile, fontSchemeFile);
            theme.ApplyTo(Web, true);
        }

    }
}
