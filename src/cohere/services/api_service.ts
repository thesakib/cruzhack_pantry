import { cohereResponse, cohereParameters, responseBody } from "../models";
import errors from "./error_service";

let encoder = new TextEncoder();
let decoder = new TextDecoder();

interface APIService {
  init(key: string, version?: string): void;
  post(
    endpoint: string,
    data: cohereParameters
  ): Promise<cohereResponse<responseBody>>;
}

enum URL {
  COHERE_API = "https://api.cohere.ai",
}

class APIImpl implements APIService {
  private COHERE_API_KEY = "";
  private COHERE_VERSION = "";

  public init(key: string, version?: string): void {
    this.COHERE_API_KEY = key;

    if (version === undefined) {
      this.COHERE_VERSION = "2022-12-06"; // currently latest, update when we version better
    } else {
      this.COHERE_VERSION = version;
    }
  }

  public async post(
    endpoint: string,
    data: cohereParameters
  ): Promise<cohereResponse<responseBody>> {
    return new Promise((resolve, reject) => {
      try {
        // workaround for js projects that pass json strings.
        data = JSON.parse(`${data}`);
      } catch (e) { }
      const reqData = JSON.stringify(data);
      const req = fetch(URL.COHERE_API + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": encoder.encode(reqData).length.toString(),
          "Cohere-Version": this.COHERE_VERSION,
          Authorization: `Bearer ${this.COHERE_API_KEY}`,
          "Request-Source": "node-sdk",
        },
        body: reqData
      }).then((res) => {
        console.log(res);
        const data: Uint8Array[] = [];

        if ("x-api-warning" in res.headers) {
          const warnHeader = res.headers["x-api-warning"];
          if (typeof warnHeader === "string") {
            console.warn("Warning: %s", warnHeader);
          } else {
            for (const warning in warnHeader as any) {
              console.warn("Warning: %s", warning);
            }
          }
        }

        return res.json().then((result) => {
          resolve({
            statusCode: res.status,
            body: result,
          });
        })
      }).catch((error: Record<string, unknown>) => {
        reject(errors.handleError(error))
      });
    });
  }
}

const API = new APIImpl();
export default API;
