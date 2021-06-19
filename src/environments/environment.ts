// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

 const url = "http://localhost:5576/"
//const url = "http://sjmek.ir/rsv/"
export const environment = {
    url: url,
    production: false,
    hmr: false,
    api_url: url + 'api',
    file_url: url + 'uploads',
    temp_url: url + 'UploadTemps',
    sunrsv_pics: url + 'pics',
    cheque_designer_url: 'http://192.168.25.104:8095/Designer/',
    cheque_print_url: 'http://192.168.25.104:8095/Print/',
};