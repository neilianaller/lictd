import tls from "node:tls";
import sslDomains from "@/data/ssl-domains.json";

export type SslDomain = { name: string; domain: string };
export type SslStatus = { name: string; domain: string; expiry: string | null; error: boolean };

const CONNECT_TIMEOUT_MS = 5000;

// Opens a TLS connection to retrieve the peer certificate's expiry date, without throwing.
function checkCertificate(domain: string): Promise<{ expiry: string | null; error: boolean }> {
  return new Promise((resolve) => {
    let settled = false;

    const finish = (result: { expiry: string | null; error: boolean }) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };

    const socket = tls.connect(
      {
        host: domain,
        port: 443,
        servername: domain,
        timeout: CONNECT_TIMEOUT_MS,
      },
      () => {
        const cert = socket.getPeerCertificate();
        if (cert && cert.valid_to) {
          finish({ expiry: new Date(cert.valid_to).toISOString(), error: false });
        } else {
          finish({ expiry: null, error: true });
        }
      }
    );

    socket.on("error", () => finish({ expiry: null, error: true }));
    socket.on("timeout", () => finish({ expiry: null, error: true }));
  });
}

export async function getSslStatuses(): Promise<SslStatus[]> {
  const domains = sslDomains as SslDomain[];
  return Promise.all(
    domains.map(async ({ name, domain }) => {
      const { expiry, error } = await checkCertificate(domain);
      return { name, domain, expiry, error };
    })
  );
}
