export const getBaseUrl = () => {
  let url;
  if(process.env.REACT_APP_ENV === 'development'){
      url = process.env.REACT_APP_DEV_API_URL;
  }
  if(process.env.REACT_APP_ENV === 'production'){
      url = process.env.REACT_APP_PROD_API_URL;
  }
  return url;
}

export const constants = {
  SOCKETIO_EVENT_BIN_UPDATED: "SOCKETIO_EVENT_BIN_UPDATED",
}