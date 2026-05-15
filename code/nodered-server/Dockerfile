FROM nodered/node-red:latest-22-minimal
COPY settings.js /usr/src/node-red/settings.js
COPY flows.json /usr/src/node-red/flows.json
COPY flows_cred.json /usr/src/node-red/flows_cred.json
RUN npm install ajv @flowfuse/node-red-dashboard@1.29.0 node-red-contrib-influxdb@0.7.0 node-red-contrib-mongodb4@3.1.1 node-red-contrib-full-msg-json-schema-validation@1.1.0 node-red-node-email@5.0.0
CMD ["--flowFile", "/usr/src/node-red/flows.json", "-s", "/usr/src/node-red/settings.js"]
