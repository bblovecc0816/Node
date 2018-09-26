var express = require('express');
var config = require('../config');

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var router = express.Router();

var jsonArray = [];

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with log a resource');
});

router.get('/listAll', function(req, res, next) {
    var connection = new Connection(config.development.database);
    var retval = '';
    var sqlstring = 'select * from dp_failedtriggers WHERE Result IS NULL order by addedon';
    connection.on('connect', function(err){
        var request;
        request = new Request(sqlstring, function(err, rowCount, rows) {
            if (err){
                console.log('Error');
                connection.close();
            } else {
                console.log('connect!');
                var rowarray = [];
                rows.forEach(function(columns){
                    var rowdata = new Object();
                    columns.forEach(function(column) {
                        rowdata[column.metadata.colName] = column.value;
                    });
                    rowarray.push(rowdata);
                })
                connection.close();
                res.contentType('application/json');
                retval = JSON.stringify(rowarray);

                res.write(retval);
                res.end();
                //console.log(retval);
            }
        });
        connection.execSql(request);
    });
});

router.get('/getDetails/tc/:tcid/triggerpoint/:tp/interfacequeuename/:qname', function(req, res, next) {
    var connection = new Connection(config.development.database);

    var retval = '';

    var tc = req.params.tcid;
    var triggerpoint = req.params.tp;
    var interfacequeuename = req.params.qname;
    var sqlstring = 'select * from dp_failedtriggers WHERE' +
        ' TruckCenterID = @tcid and' +
        ' TriggerPointEnum = @tp and' +
        ' InterfaceQueueName = @qname and' +
        ' Result IS NULL order by addedon';
    console.log('sql query:' + sqlstring);
    connection.on('connect', function(err){
        var request;
        request = new Request(sqlstring, function(err, rowCount, rows) {
            if (err){
                console.log('Error');
                connection.close();
            } else {
                console.log('connect!');
                var rowarray = [];
                rows.forEach(function(columns){
                    var rowdata = new Object();
                    columns.forEach(function(column) {
                        rowdata[column.metadata.colName] = column.value;
                    });
                    rowarray.push(rowdata);
                })
                connection.close();
                res.contentType('application/json');
                retval = JSON.stringify(rowarray);

                res.write(retval);
                res.end();
                //console.log(retval);
            }
        });
        request.addParameter('tcid', TYPES.Int, tc);
        request.addParameter('tp', TYPES.NVarChar, triggerpoint);
        request.addParameter('qname', TYPES.NVarChar, interfacequeuename);
        connection.execSql(request);
    });
});

router.get('/listTriggerSummary', function(req, res, next) {
    var connection = new Connection(config.development.database);
    var retval = '';
    var sqlstring = 'SELECT InterfaceQueueName, TruckCenterID, FailedCount AS [NumberOfMsgOut], StatisticDate'
        +
        ' FROM dp_alltriggers_summary ORDER BY TruckCenterID ASC, InterfaceQueueName ASC';
    connection.on('connect', function(err){
        var request;
        request = new Request(sqlstring, function(err, rowCount, rows) {
            if (err){
                console.log('Error');
                connection.close();
            } else {
                console.log('connect!');
                var rowarray = [];
                rows.forEach(function(columns){
                    var rowdata = new Object();
                    columns.forEach(function(column) {
                        rowdata[column.metadata.colName] = column.value;
                    });
                    rowarray.push(rowdata);
                })
                connection.close();
                res.contentType('application/json');
                retval = JSON.stringify(rowarray);

                res.write(retval);
                res.end();
                //console.log(retval);
            }
        });
        connection.execSql(request);
    });
});

router.get('/listTriggerFailedSummary', function(req, res, next) {
    var connection = new Connection(config.development.database);
    var retval = '';
    var sqlstring = 'SELECT t.TruckCenter,t.TruckCenterID, StatisticDate, sum(FailedCount) AS [NumberOfMsgFailed]\n' +
        'FROM dp_failedtrigger_summary s INNER JOIN EUD.dbo.adtbTruckCenters t ON t.TruckCenterID = s.TruckCenterID AND t.Environ = \'p\'\n' +
        'GROUP BY t.TruckCenterID, t.TruckCenter, s.StatisticDate\n' +
        'ORDER BY t.TruckCenter ASC, s.StatisticDate ASC';
    connection.on('connect', function(err){
        var request;
        request = new Request(sqlstring, function(err, rowCount, rows) {
            if (err){
                console.log('Error');
                connection.close();
            } else {
                console.log('connect!');
                var rowarray = [];
                rows.forEach(function(columns){
                    var rowdata = new Object();
                    columns.forEach(function(column) {
                        rowdata[column.metadata.colName] = column.value;
                    });
                    rowarray.push(rowdata);
                })
                connection.close();
                res.contentType('application/json');
                retval = JSON.stringify(rowarray);

                res.write(retval);
                res.end();
                //console.log(retval);
            }
        });
        connection.execSql(request);
    });
});

router.get('/getFailedTriggerDetails/tcid/:tcid/date/:date', function(req, res, next) {
    var connection = new Connection(config.development.database);

    var retval = '';

    var tc = req.params.tcid;
    var date = req.params.date;
    var interfacequeuename = req.params.qname;
    var sqlstring = 'SELECT t.TruckCenterID, t.TruckCenter,s.InterfaceQueueName, StatisticDate, sum(FailedCount) AS [NumberOfMsgFailed]\n' +
        'FROM dp_failedtrigger_summary s INNER JOIN EUD.dbo.adtbTruckCenters t ON t.TruckCenterID = s.TruckCenterID \n' +
        'AND t.Environ = \'p\'\n' +
        'WHERE t.TruckCenterID = @tcid AND s.StatisticDate = @date\n' +
        'GROUP BY t.TruckCenterID, t.TruckCenter, s.InterfaceQueueName, s.StatisticDate\n' +
        'ORDER BY t.TruckCenter ASC, s.InterfaceQueueName ASC, s.StatisticDate ASC';
    console.log('sql query:' + sqlstring);
    connection.on('connect', function(err){
        var request;
        request = new Request(sqlstring, function(err, rowCount, rows) {
            if (err){
                console.log('Error');
                connection.close();
            } else {
                console.log('connect!');
                var rowarray = [];
                rows.forEach(function(columns){
                    var rowdata = new Object();
                    columns.forEach(function(column) {
                        rowdata[column.metadata.colName] = column.value;
                    });
                    rowarray.push(rowdata);
                })
                connection.close();
                res.contentType('application/json');
                retval = JSON.stringify(rowarray);

                res.write(retval);
                res.end();
                //console.log(retval);
            }
        });
        request.addParameter('tcid', TYPES.Int, tc);
        request.addParameter('date', TYPES.NVarChar, date);
        connection.execSql(request);
    });
});

router.get('/allTriggersByInterfaceQueueName', function(req, res, next) {
    var connection = new Connection(config.development.database);
    /*connection.on('connect', function(err) {
        if (err) {
            console.log(err);
            connection.close();
        } else {

            console.log("Connected");
            executeStatement(connection);
            res.contentType('application/json');
            res.write(JSON.stringify(jsonArray));
            res.end();
        }
    });*/
    var retval = '';
    var sqlstring = 'SELECT InterfaceQueueName, SUM(FailedCount) AS [Number] FROM dp_alltriggers_summary GROUP BY InterfaceQueueName';
    connection.on('connect', function(err){
        var request;
        request = new Request(sqlstring, function(err, rowCount, rows) {
            if (err){
                console.log('Error');
                connection.close();
            } else {
                console.log('connect!');
                var rowarray = [];
                rows.forEach(function(columns){
                    var rowdata = new Object();
                    columns.forEach(function(column) {
                        rowdata[column.metadata.colName] = column.value;
                    });
                    rowarray.push(rowdata);
                })
                connection.close();
                res.contentType('application/json');
                retval = JSON.stringify(rowarray);

                res.write(retval);
                res.end();
                //console.log(retval);
            }
        });
        connection.execSql(request);
    });
});

router.get('/allTriggersByTruckCenter', function(req, res, next) {
    var connection = new Connection(config.development.database);
    var retval = '';
    var sqlstring = 'SELECT \n' +
        't.TruckCenter,t.TruckCenterID, sum(FailedCount) AS [Number] \n' +
        'FROM dp_alltriggers_summary s INNER JOIN EUD.dbo.adtbTruckCenters t ON t.TruckCenterID = s.TruckCenterID AND t.Environ = \'p\'\n' +
        'GROUP BY t.TruckCenterID, t.TruckCenter\n' +
        'ORDER BY t.TruckCenterID ASC';
    connection.on('connect', function(err){
        var request;
        request = new Request(sqlstring, function(err, rowCount, rows) {
            if (err){
                console.log('Error');
                connection.close();
            } else {
                console.log('connect!');
                var rowarray = [];
                rows.forEach(function(columns){
                    var rowdata = new Object();
                    columns.forEach(function(column) {
                        rowdata[column.metadata.colName] = column.value;
                    });
                    rowarray.push(rowdata);
                })
                connection.close();
                res.contentType('application/json');
                retval = JSON.stringify(rowarray);

                res.write(retval);
                res.end();
                //console.log(retval);
            }
        });
        connection.execSql(request);
    });
});

router.get('/failedTriggersByTruckCenter', function(req, res, next) {
    var connection = new Connection(config.development.database);
    /*connection.on('connect', function(err) {
        if (err) {
            console.log(err);
            connection.close();
        } else {

            console.log("Connected");
            executeStatement(connection);
            res.contentType('application/json');
            res.write(JSON.stringify(jsonArray));
            res.end();
        }
    });*/
    var retval = '';
    var sqlstring = 'SELECT \n' +
        't.TruckCenter,t.TruckCenterID, StatisticDate,sum(FailedCount) AS [NumberOfMsgFailed] FROM dp_failedtrigger_summary s INNER JOIN EUD.dbo.adtbTruckCenters t ON t.TruckCenterID = s.TruckCenterID AND t.Environ = \'p\'\n' +
        'GROUP BY t.TruckCenterID, t.TruckCenter, s.StatisticDate\n' +
        'ORDER BY t.TruckCenter ASC, s.StatisticDate ASC';
    connection.on('connect', function(err){
        var request;
        request = new Request(sqlstring, function(err, rowCount, rows) {
            if (err){
                console.log('Error');
                connection.close();
            } else {
                console.log('connect!');
                var rowarray = [];
                rows.forEach(function(columns){
                    var rowdata = new Object();
                    columns.forEach(function(column) {
                        rowdata[column.metadata.colName] = column.value;
                    });
                    rowarray.push(rowdata);
                })
                connection.close();
                res.contentType('application/json');
                retval = JSON.stringify(rowarray);

                res.write(retval);
                res.end();
                //console.log(retval);
            }
        });
        connection.execSql(request);
    });
});

function executeStatement(sqlConnect) {
    var sql = 'select * from dp_failedtriggers order by addedon';
    request = new Request(sql, function(err, rowCount) {
        if (err) {
            console.log(err);
        } else {
            console.log(rowCount + ' rows');
        }
        sqlConnect.close();
    });

    request.on('row', function(columns) {
        var rowObject ={};
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                rowObject[column.metadata.colName] = column.value;
                console.log(column.value);
            }
        });
        jsonArray.push(rowObject);
        console.log('------------------->');
    });
    request.on('requestCompleted', function () {
        console.log(JSON.stringify(jsonArray));
    });
    sqlConnect.execSql(request);
}

module.exports = router;

