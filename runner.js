const createTestCafe = require('testcafe');
let testcafe         = null;

createTestCafe('localhost', 1337, 1338)
    .then(tc => {
        testcafe     = tc;
        const runner = testcafe.createRunner();

        return runner
            .src(['./test1.js'])
            .browsers(['chrome'])
            .reporter('html-testrail')
            .run( {"skipJsErrors": true,
            "speed": 0.6
        })
            
    })
    .then(failedCount => {
        console.log('Tests failed: ' + failedCount);
        testcafe.close();
    });