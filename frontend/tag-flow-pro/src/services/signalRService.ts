import * as signalR from "@microsoft/signalr";
import { MAIN_HOST } from "shared/consts";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${MAIN_HOST}/file-status-hub`)
  .configureLogging(signalR.LogLevel.Information)
  .build();

const signalRService = {
  startConnection: async () => {
    try {
      await connection.start();
    } catch (error) {
      setTimeout(() => signalRService.startConnection(), 5000);
    }
  },

  onFileStatusUpdated: (
    callback: (fileId: number, downloadLink: string, fileStatus: string) => void
  ) => {
    connection.on("FileStatusUpdated", callback);
  },

  stopConnection: async () => {
    try {
      await connection.stop();
    } catch (error) {
      console.error("Error stopping SignalR connection: ", error);
    }
  },
};

export default signalRService;
