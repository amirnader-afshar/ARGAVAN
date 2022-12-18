// const url = "http://192.168.25.104:8201/";
// const url = "http://192.168.25.65:8201/" // Optic Publish Test;
//const url = "http://192.168.25.65:9201/" //hotel local test
const url = "http://localhost:5576/"; //Hotel
export const environment = {
  url: url,
  production: true,
  remove_console_log: true,
  remove_console_warning: true,
  hmr: false,
  aot:false,
  api_url: url + 'api',
  file_url: url + 'uploads',
  temp_url: url + 'UploadTemps',
  cheque_designer_url: '',
  cheque_print_url: '',
  syncfusion_api_url : url+ 'api/EDM/syncfusion/'
};
