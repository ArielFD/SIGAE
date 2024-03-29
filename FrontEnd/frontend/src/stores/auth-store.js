import { defineStore } from "pinia";
import { api } from "boot/axios.js";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    jwt: null,
    email: "",
    password: "",
    isPwd: true,
    user: null,
    ip: "",
    printMode:false,
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async postTraza(params1, params2) {
      const data = {
        data: {
          fecha: new Date().toISOString(),
          // ip: this.ip,
          ip: window.location.hostname,
          user: this.user.username,
          operacion: params1,
          resultado: params2,
        },
      };

      const authorization = {
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
      };

      await api
        .post("/trazas", data, authorization)
        .then(function (response) {
          //console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    getLocalIP() {
      // La solucion: https://gist.github.com/hectorguo/672844c319547498dcb569df583f959d
      //First of all, you have to turn off/disable webrtc in Chrome. Copy this link and paste it in your Chrome address
      //-> "chrome://flags/#enable-webrtc-hide-local-ips-with-mdns", then select "disabled".
      return new Promise(function (resolve, reject) {
        // NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
        var RTCPeerConnection =
          /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection ||
          window.mozRTCPeerConnection;

        if (!RTCPeerConnection) {
          reject("Your browser does not support this API");
        }

        var rtc = new RTCPeerConnection({ iceServers: [] });
        var addrs = {};
        addrs["0.0.0.0"] = false;

        function grepSDP(sdp) {
          var hosts = [];
          var finalIP = "";
          sdp.split("\r\n").forEach(function (line) {
            // c.f. http://tools.ietf.org/html/rfc4566#page-39
            if (~line.indexOf("a=candidate")) {
              // http://tools.ietf.org/html/rfc4566#section-5.13
              var parts = line.split(" "), // http://tools.ietf.org/html/rfc5245#section-15.1
                addr = parts[4],
                type = parts[7];
              if (type === "host") {
                finalIP = addr;
              }
            } else if (~line.indexOf("c=")) {
              // http://tools.ietf.org/html/rfc4566#section-5.7
              var parts = line.split(" "),
                addr = parts[2];
              finalIP = addr;
            }
          });
          return finalIP;
        }

        if (1 || window.mozRTCPeerConnection) {
          // FF [and now Chrome!] needs a channel/stream to proceed
          rtc.createDataChannel("", { reliable: false });
        }

        rtc.onicecandidate = function (evt) {
          // convert the candidate to SDP so we can run it through our general parser
          // see https://twitter.com/lancestout/status/525796175425720320 for details
          if (evt.candidate) {
            var addr = grepSDP("a=" + evt.candidate.candidate);
            resolve(addr);
          }
        };
        rtc.createOffer(
          function (offerDesc) {
            rtc.setLocalDescription(offerDesc);
          },
          function (e) {
            console.warn("offer failed", e);
          }
        );
      });
    },
  },
});
