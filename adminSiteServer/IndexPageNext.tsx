import { ENV, DATA_API_FOR_ADMIN_UI } from "../settings/serverSettings.js"
import { viteAssetsForAdminNext } from "../site/viteUtils.js"

export const IndexPageNext = (props: {
    email: string
    username: string
    isSuperuser: boolean
}) => {
    const assets = viteAssetsForAdminNext()
    const script = `
        window.adminNext = {
          username: "${props.username}",
          email: "${props.email}",
          isSuperuser: ${props.isSuperuser.toString()},
        }
`

    return (
        <html lang="en">
            <head>
                <title>owid-admin-next</title>
                <meta name="description" content="" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                {assets.forHeader}
            </head>
            <body>
                <div id="app"></div>
                <script
                    dangerouslySetInnerHTML={{ __html: script }}
                />
                {assets.forFooter}
            </body>
        </html>
    )
}
