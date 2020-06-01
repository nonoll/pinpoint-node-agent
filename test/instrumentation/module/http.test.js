const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const axios = require('axios')

test(`outgoing request URL escape a bug`, async (t) => {
    agent.bindHttp()

    t.plan(5)

    const trace = agent.createTraceObject()
    t.true(trace)

    axios.get(`https://eonet.sci.gsfc.nasa.gov/api/v2.1/categories`)
        .then(function (response) {
            t.true(response.status == 200)

            t.true(agent.pinpointClient.dataSender.mockSpanChunk.spanEventList.length == 1, `a spanEventList`)

            const spanEvent = agent.pinpointClient.dataSender.mockSpanChunk.spanEventList[0]
            
            t.equal(spanEvent.annotations[0].value.stringValue, "GET", "URL")
            t.equal(spanEvent.annotations[1].value.stringValue, "eonet.sci.gsfc.nasa.gov/api/v2.1/categories", "URL")
            agent.completeTraceObject(trace)
        })
})