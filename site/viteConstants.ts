export const VITE_ASSET_SITE_ENTRY = "site/owid.entry.ts"
export const VITE_ASSET_ARCHIVE_ENTRY = "site/owid-archive.entry.ts"
export const VITE_ASSET_ADMIN_ENTRY = "adminSiteClient/admin.entry.ts"
export const VITE_ASSET_ADMIN_NEXT_ENTRY = "adminNext/entry.ts"

export enum ViteEntryPoint {
    Site = "site",
    Archive = "archive",
    Admin = "admin",
    AdminNext = "admin-next",
}

export const VITE_ENTRYPOINT_INFO = {
    [ViteEntryPoint.Site]: {
        entryPointFile: VITE_ASSET_SITE_ENTRY,
        outDir: "assets",
        outName: "owid",
    },
    [ViteEntryPoint.Archive]: {
        entryPointFile: VITE_ASSET_ARCHIVE_ENTRY,
        outDir: "assets-archive",
        outName: "owid",
    },
    [ViteEntryPoint.Admin]: {
        entryPointFile: VITE_ASSET_ADMIN_ENTRY,
        outDir: "assets-admin",
        outName: "admin",
    },
    [ViteEntryPoint.AdminNext]: {
        entryPointFile: VITE_ASSET_ADMIN_NEXT_ENTRY,
        outDir: "assets-admin-next",
        outName: "admin-next",
    },
}
