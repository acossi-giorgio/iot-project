export const constant = {
    sessionStatus: {
        active: "active",
        inactive: "inactive",
    },
    interactionType: {
        edge: "edge",
        chat: "chat",
        rag: "rag",
        ragWithRephrasing: "ragWithRephrasing",
        dataAnalysis: "dataAnalysis",
    },
    sensorType: {
        heartRate: "hr",
        respirationRate: "rr",
        oxygenSaturation: "spo2",
        temperature: "temp",
        systolicBloodPressure: "sbp",
        diastolicBloodPressure: "dbp",
        glucose: "glucose"
    },
    documentMetadata: {
        source: "source",
        page: "page"
    },
    influxVitalsMap:{
        "vitals_respiratory_rate": "rr",
        "vitals_spo2": "spo2",
        "vitals_body_temperature": "temp",
        "vitals_blood_pressure_dia": "dbp",
        "vitals_blood_pressure_sys": "sbp",
        "vitals_glucose": "glucose",
        "vitals_heart_rate": "hr",
    }
};