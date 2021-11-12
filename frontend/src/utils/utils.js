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
  VOLUME_PROGRESS_COLOR_OK: "bg-emerald-500",
  VOLUME_PROGRESS_COLOR_ALMOST: "bg-yellow-500",
  VOLUME_PROGRESS_COLOR_FULL: "bg-red-500",
  VOLUME_BADGE_COLOR_OK: "text-emerald-500",
  VOLUME_BADGE_COLOR_ALMOST: "text-yellow-500",
  VOLUME_BADGE_COLOR_FULL: "text-red-500",
}