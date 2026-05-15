FROM nodered/node-red:latest-22-minimal
COPY settings.js /usr/src/node-red/settings.js
COPY flows.json /usr/src/node-red/flows.json
RUN npm install ajv node-red-contrib-redis@1.4.0 node-red-contrib-full-msg-json-schema-validation@1.1.0
CMD ["--flowFile", "/usr/src/node-red/flows.json", "-s", "/usr/src/node-red/settings.js"]
