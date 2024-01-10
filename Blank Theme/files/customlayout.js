var QueueIt;
(function (QueueIt) {
    var Javascript;
    (function (Javascript) {
        var _queueitBuildJsVersion = "2.0.38";
        Javascript.Version = _queueitBuildJsVersion;
    })(Javascript = QueueIt.Javascript || (QueueIt.Javascript = {}));
})(QueueIt || (QueueIt = {}));

var QueueIt;
(function (QueueIt) {
    var Tools;
    (function (Tools) {
        var Json = /** @class */ (function () {
            function Json() {
            }
            Json.parse = function (text, reviver) {
                if (reviver === void 0) { reviver = null; }
                if (!text)
                    return null;
                if (typeof JSON === 'object')
                    return JSON.parse(text, reviver);
                var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
                // The parse method takes a text and an optional reviver function, and returns
                // a JavaScript value if the text is a valid JSON text.
                var j;
                function walk(holder, key) {
                    // The walk method is used to recursively walk the resulting structure so
                    // that modifications can be made.
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                }
                                else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }
                // Parsing happens in four stages. In the first stage, we replace certain
                // Unicode characters with escape sequences. JavaScript handles many characters
                // incorrectly, either silently deleting them, or treating them as line endings.
                text = String(text);
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }
                // In the second stage, we run the text against regular expressions that look
                // for non-JSON patterns. We are especially concerned with '()' and 'new'
                // because they can cause invocation, and '=' because it can cause mutation.
                // But just to be safe, we want to reject all unexpected forms.
                // We split the second stage into 4 regexp operations in order to work around
                // crippling inefficiencies in IE's and Safari's regexp engines. First we
                // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                // replace all simple value tokens with ']' characters. Third, we delete all
                // open brackets that follow a colon or comma or that begin the text. Finally,
                // we look to see that the remaining characters are only whitespace or ']' or
                // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                    // In the third stage we use the eval function to compile the text into a
                    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                    // in JavaScript: it can begin a block or an object literal. We wrap the text
                    // in parens to eliminate the ambiguity.
                    j = eval('(' + text + ')');
                    // In the optional fourth stage, we recursively walk the new structure, passing
                    // each name/value pair to a reviver function for possible transformation.
                    return typeof reviver === 'function'
                        ? walk({ '': j }, '')
                        : j;
                }
                // If the text is not JSON parseable, then a SyntaxError is thrown.
                throw new SyntaxError('JSON.parse');
            };
            return Json;
        }());
        Tools.Json = Json;
    })(Tools = QueueIt.Tools || (QueueIt.Tools = {}));
})(QueueIt || (QueueIt = {}));

var QueueIt;
(function (QueueIt) {
    var Javascript;
    (function (Javascript) {
        var CustomLayout;
        (function (CustomLayout) {
            var PostResult = /** @class */ (function () {
                function PostResult() {
                }
                PostResult.ENTERED_QUEUE_GOT_QUEUEID = "EnteredQueueGotQueueId";
                PostResult.QUEUEID_ALREADY_EXIST = "QueueIdAlreadyExist";
                PostResult.INVALID_CAPTCHA_TOKEN = "InvalidCaptchaToken";
                PostResult.MISSING_CUSTOM_DATA_KEY = "MissingCustomDataKey";
                PostResult.UNIQUE_KEY_VIOLATION = "UniqueKeyViolation";
                PostResult.UNEXPECTED_FAILURE_TO_ENQUEUE = "UnexpectedFailureToEnqueue";
                PostResult.IDLE_QUEUE_ILLEGAL_ACTION = "IdleQueueIllegalAction";
                PostResult.CUSTOM_DATA_UPDATED = "CustomDataUpdated";
                PostResult.MISSING_QUEUE_ID = "MissingQueueId";
                PostResult.UNEXPECTED_FAILURE_TO_UPDATE = "UnexpectedFailureToUpdate";
                PostResult.INVALID_QUEUEIT_ENQUEUE_TOKEN = "InvalidQueueitEnqueueToken";
                PostResult.SERVER_IS_BUSY = "ServerBusyError";
                return PostResult;
            }());
            var QueueUserManager = /** @class */ (function () {
                function QueueUserManager(notifyDirectly, getQueryString) {
                    var _this = this;
                    if (notifyDirectly === void 0) { notifyDirectly = true; }
                    this.getQueryString = function () { return window.location.search.substring(1); };
                    this.enqueueWithTokenFromUrl = function (onEnqueued, onEnqueueFailed) {
                        _this.enqueueWithToken(_this.getQueryStringParam('qet'), onEnqueued, onEnqueueFailed);
                    };
                    this.enqueueWithKeyFromUrl = function (onEnqueued, onEnqueueFailed) {
                        _this.enqueueWithKey(_this.getQueryStringParam('enqueueKey'), onEnqueued, onEnqueueFailed);
                    };
                    this.enqueueWithToken = function (token, onEnqueued, onEnqueueFailed) {
                        _this.onEnqueued = onEnqueued;
                        _this.onEnqueueFailed = onEnqueueFailed;
                        var payload = {
                            'Type': 'QueueitEnqueueToken',
                            'QueueitEnqueueToken': token
                        };
                        _this.postToParent(payload);
                    };
                    this.enqueueWithCustomData = function (key, email, pairs, onEnqueued, onEnqueueFailed) {
                        _this.onEnqueued = onEnqueued;
                        _this.onEnqueueFailed = onEnqueueFailed;
                        var payload = {
                            'Type': 'Enqueue',
                            'Key': key,
                            'Email': email,
                            'CustomData': pairs
                        };
                        _this.postToParent(payload);
                    };
                    this.enqueueWithKey = function (key, onEnqueued, onEnqueueFailed) {
                        _this.onEnqueued = onEnqueued;
                        _this.onEnqueueFailed = onEnqueueFailed;
                        var payload = {
                            'Type': 'Enqueue',
                            'Key': key,
                            'Email': null,
                            'CustomData': null
                        };
                        _this.postToParent(payload);
                    };
                    this.postToParent = function (payload) {
                        parent.postMessage(payload, '*');
                    };
                    this.notifyDirect = function (data) {
                        _this.handleMessageReceived(data);
                    };
                    this.receiveMessage = function (message) {
                        if (message.data && message.data.Type) {
                            return;
                        }
                        var data = _this.deserialize(message.data);
                        _this.handleMessageReceived(data);
                    };
                    this.handleMessageReceived = function (data) {
                        if (data.messageType == PostResult.ENTERED_QUEUE_GOT_QUEUEID && _this.onEnqueued) {
                            _this.onEnqueued(data.queueId);
                        }
                        else if (data.messageType == PostResult.IDLE_QUEUE_ILLEGAL_ACTION && _this.onEnqueueFailed) {
                            _this.onEnqueueFailed(PostResult.IDLE_QUEUE_ILLEGAL_ACTION, data.enqueueParams);
                        }
                        else if (data.messageType == PostResult.QUEUEID_ALREADY_EXIST && _this.onEnqueueFailed) {
                            _this.onEnqueueFailed(PostResult.QUEUEID_ALREADY_EXIST, data.enqueueParams);
                        }
                        else if (data.messageType == PostResult.INVALID_CAPTCHA_TOKEN && _this.onEnqueueFailed) {
                            _this.onEnqueueFailed(PostResult.INVALID_CAPTCHA_TOKEN, data.enqueueParams);
                        }
                        else if (data.messageType == PostResult.MISSING_CUSTOM_DATA_KEY && _this.onEnqueueFailed) {
                            _this.onEnqueueFailed(PostResult.MISSING_CUSTOM_DATA_KEY, data.enqueueParams);
                        }
                        else if (data.messageType == PostResult.UNIQUE_KEY_VIOLATION && _this.onEnqueueFailed) {
                            _this.onEnqueueFailed(PostResult.UNIQUE_KEY_VIOLATION, data.enqueueParams);
                        }
                        else if (data.messageType == PostResult.UNEXPECTED_FAILURE_TO_ENQUEUE && _this.onEnqueueFailed) {
                            _this.onEnqueueFailed(PostResult.UNEXPECTED_FAILURE_TO_ENQUEUE, data.enqueueParams);
                        }
                        else if (data.messageType == PostResult.CUSTOM_DATA_UPDATED && _this.customdata.onCustomDataUpdated) {
                            _this.customdata.onCustomDataUpdated();
                        }
                        else if (data.messageType == PostResult.MISSING_QUEUE_ID && _this.customdata.onCustomDataUpdateFailed) {
                            _this.customdata.onCustomDataUpdateFailed(PostResult.MISSING_QUEUE_ID);
                        }
                        else if (data.messageType == PostResult.UNEXPECTED_FAILURE_TO_UPDATE && _this.customdata.onCustomDataUpdateFailed) {
                            _this.customdata.onCustomDataUpdateFailed(PostResult.UNEXPECTED_FAILURE_TO_UPDATE);
                        }
                        else if (data.messageType == PostResult.INVALID_QUEUEIT_ENQUEUE_TOKEN && _this.onEnqueueFailed) {
                            _this.onEnqueueFailed(PostResult.INVALID_QUEUEIT_ENQUEUE_TOKEN, data.enqueueParams);
                        }
                        else if (data.messageType == PostResult.SERVER_IS_BUSY && _this.onEnqueueFailed) {
                            _this.onEnqueueFailed(PostResult.SERVER_IS_BUSY, data.enqueueParams);
                        }
                    };
                    this.listenParentFrame = function () {
                        if (window.addEventListener) {
                            window.addEventListener("message", _this.receiveMessage, false);
                        }
                        else if (window.attachEvent) {
                            window.attachEvent("onmessage", function (event) { return _this.receiveMessage; });
                        }
                    };
                    this.customdata = new CustomData(this);
                    this.listenParentFrame();
                    if (notifyDirectly) {
                        window.queueUserManager = this;
                    }
                    if (getQueryString) {
                        this.getQueryString = getQueryString;
                    }
                }
                QueueUserManager.prototype.deserialize = function (message) {
                    try {
                        var result = QueueIt.Tools.Json.parse(message);
                        if (result) {
                            return result;
                        }
                        return {};
                    }
                    catch (e) {
                        return {};
                    }
                };
                QueueUserManager.prototype.getQueryStringParam = function (paramName) {
                    var kvPairs = this.getQueryString().split('&');
                    for (var _i = 0, kvPairs_1 = kvPairs; _i < kvPairs_1.length; _i++) {
                        var kvPair = kvPairs_1[_i];
                        var key = kvPair.split('=')[0];
                        if (key == paramName) {
                            return kvPair.split('=')[1];
                        }
                    }
                    return undefined;
                };
                return QueueUserManager;
            }());
            CustomLayout.QueueUserManager = QueueUserManager;
            var CustomData = /** @class */ (function () {
                function CustomData(queueUserManager) {
                    var _this = this;
                    this.queueUserManager = queueUserManager;
                    this.update = function (email, pairs, onCustomDataupdated, onCustomDataUpdateFailed) {
                        _this.onCustomDataUpdated = onCustomDataupdated;
                        _this.onCustomDataUpdateFailed = onCustomDataUpdateFailed;
                        var payload = {
                            'Type': 'Update',
                            'Email': email,
                            'CustomData': pairs
                        };
                        _this.queueUserManager.postToParent(payload);
                    };
                }
                return CustomData;
            }());
            CustomLayout.CustomData = CustomData;
        })(CustomLayout = Javascript.CustomLayout || (Javascript.CustomLayout = {}));
    })(Javascript = QueueIt.Javascript || (QueueIt.Javascript = {}));
})(QueueIt || (QueueIt = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var QueueIt;
(function (QueueIt) {
    var Javascript;
    (function (Javascript) {
        var CustomLayout;
        (function (CustomLayout) {
            var UserInfo = /** @class */ (function () {
                function UserInfo(customerId, queueId, eventId, cultureId, targetUrl, tags) {
                    this.queueNumber = null;
                    this.customerId = customerId;
                    this.queueId = queueId;
                    this.eventId = eventId;
                    this.cultureId = cultureId;
                    this.targetUrl = targetUrl;
                    this.tags = tags;
                }
                return UserInfo;
            }());
            CustomLayout.UserInfo = UserInfo;
            var KeyValuePair = /** @class */ (function () {
                function KeyValuePair(key, value) {
                    this.key = key;
                    this.value = value;
                }
                return KeyValuePair;
            }());
            var TargetUrlParam = /** @class */ (function (_super) {
                __extends(TargetUrlParam, _super);
                function TargetUrlParam() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return TargetUrlParam;
            }(KeyValuePair));
            CustomLayout.TargetUrlParam = TargetUrlParam;
            var Tag = /** @class */ (function (_super) {
                __extends(Tag, _super);
                function Tag() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Tag;
            }(KeyValuePair));
            CustomLayout.Tag = Tag;
            var QueueUserInfoClient = /** @class */ (function () {
                function QueueUserInfoClient(queryStringProvider) {
                    if (queryStringProvider === void 0) { queryStringProvider = null; }
                    this.onUsersInLineAheadOfYouChanged = function (_) { };
                    this.onQueueNumberChanged = function (_) { };
                    this.onQueueIdChanged = function (_) { };
                    this.onPageIdChanged = function (_) { };
                    this.onTargetUrlParamsChanged = function (_) { };
                    this.onTargetUrlChanged = function (_) { };
                    this.onTagsChanged = function (_) { };
                    this.userInfo = this.getUserInfo(queryStringProvider);
                    this.listenParentFrame();
                    this.requestRefresh();
                }
                QueueUserInfoClient.prototype.getCustomerId = function () {
                    return this.userInfo.customerId;
                };
                QueueUserInfoClient.prototype.getQueueId = function () {
                    return this.userInfo.queueId;
                };
                QueueUserInfoClient.prototype.getEventId = function () {
                    return this.userInfo.eventId;
                };
                QueueUserInfoClient.prototype.getPageId = function () {
                    return this.userInfo.pageId;
                };
                QueueUserInfoClient.prototype.getCultureId = function () {
                    return this.userInfo.cultureId;
                };
                QueueUserInfoClient.prototype.getQueueNumber = function () {
                    return this.userInfo.queueNumber;
                };
                QueueUserInfoClient.prototype.getUsersInLineAheadOfYou = function () {
                    return this.userInfo.usersInLineAheadOfYou;
                };
                QueueUserInfoClient.prototype.getTargetUrlParams = function () {
                    return this.userInfo.targetUrlParams != null ? this.userInfo.targetUrlParams : new Array();
                };
                QueueUserInfoClient.prototype.getTargetUrlParam = function (key) {
                    return this.getFromKeyValuePairArray(this.userInfo.targetUrlParams, key);
                };
                QueueUserInfoClient.prototype.hasQueueId = function () {
                    var queueId = this.getQueueId();
                    return queueId && queueId !== "00000000-0000-0000-0000-000000000000";
                };
                QueueUserInfoClient.prototype.getTags = function () {
                    return this.userInfo.tags != null ? this.userInfo.tags : new Array();
                };
                QueueUserInfoClient.prototype.getTag = function (key) {
                    return this.getFromKeyValuePairArray(this.userInfo.tags, key);
                };
                QueueUserInfoClient.prototype.getFromKeyValuePairArray = function (array, key) {
                    if (array == null)
                        return null;
                    var keyValuePairs = array.filter(function (keyValue) { return keyValue.key === key; });
                    if (keyValuePairs.length === 0)
                        return null;
                    return keyValuePairs[0].value;
                };
                QueueUserInfoClient.prototype.getUserInfo = function (queryStringProvider) {
                    if (!queryStringProvider)
                        queryStringProvider = function () { return window.location.search.substring(1); };
                    var customerId = undefined;
                    var queueId = undefined;
                    var eventId = undefined;
                    var cultureId = undefined;
                    var qstring = queryStringProvider();
                    var kvPairs = qstring.split("&");
                    for (var i = 0; i < kvPairs.length; i++) {
                        var pair = kvPairs[i];
                        var subpair = pair.split("=");
                        if (subpair[0] === "c") {
                            customerId = subpair[1];
                        }
                        else if (subpair[0] === "q") {
                            queueId = subpair[1];
                        }
                        else if (subpair[0] === "e") {
                            eventId = subpair[1];
                        }
                        else if (subpair[0] === "cid") {
                            cultureId = subpair[1];
                        }
                    }
                    return new UserInfo(customerId, queueId, eventId, cultureId, null, null);
                };
                QueueUserInfoClient.prototype.receiveMessage = function (message, userInfo) {
                    switch (message.messageType) {
                        case "UpdateQueue":
                            {
                                if (message.queueId && this.userInfo.queueId !== message.queueId) {
                                    this.userInfo.queueId = message.queueId;
                                    this.onQueueIdChanged(this.userInfo.queueId);
                                }
                                if (message.queueNumber && this.userInfo.queueNumber !== message.queueNumber) {
                                    this.userInfo.queueNumber = message.queueNumber;
                                    this.onQueueNumberChanged(this.userInfo.queueNumber);
                                }
                                if (message.targetUrl && this.userInfo.targetUrl !== message.targetUrl) {
                                    this.userInfo.targetUrl = message.targetUrl;
                                    this.onTargetUrlChanged(this.userInfo.targetUrl);
                                }
                                if (message.usersInLineAheadOfYou && this.userInfo.usersInLineAheadOfYou !== message.usersInLineAheadOfYou) {
                                    this.userInfo.usersInLineAheadOfYou = message.usersInLineAheadOfYou;
                                    this.onUsersInLineAheadOfYouChanged(this.userInfo.usersInLineAheadOfYou);
                                }
                                if (message.pageId && this.userInfo.pageId !== message.pageId) {
                                    this.userInfo.pageId = message.pageId;
                                    this.onPageIdChanged(this.userInfo.pageId);
                                }
                                if (message.targetUrlParams && !this.areArraysEqual(message.targetUrlParams, this.userInfo.targetUrlParams)) {
                                    this.userInfo.targetUrlParams = message.targetUrlParams;
                                    this.onTargetUrlParamsChanged(this.userInfo.targetUrlParams);
                                }
                                if (message.tags && !this.areArraysEqual(message.tags, this.userInfo.tags)) {
                                    this.userInfo.tags = message.tags;
                                    this.onTagsChanged(this.userInfo.tags);
                                }
                                return;
                            }
                        default:
                            return;
                    }
                };
                QueueUserInfoClient.prototype.areArraysEqual = function (array1, array2) {
                    if (!array1 && !array2) {
                        return true;
                    }
                    if (array1 && !array2) {
                        return false;
                    }
                    if (array2 && !array1) {
                        return false;
                    }
                    if (array1.length !== array2.length) {
                        return false;
                    }
                    for (var i = 0; i < array1.length; i++) {
                        if (array1[i].key !== array2[i].key ||
                            array1[i].value !== array2[i].value) {
                            return false;
                        }
                    }
                    return true;
                };
                QueueUserInfoClient.prototype.deserialize = function (message) {
                    try {
                        var result = QueueIt.Tools.Json.parse(message);
                        if (result) {
                            return result;
                        }
                        return {};
                    }
                    catch (e) {
                        return {};
                    }
                };
                QueueUserInfoClient.prototype.listenParentFrame = function () {
                    var _this = this;
                    if (!QueueIt || !QueueIt.Tools || !QueueIt.Tools.Json)
                        return;
                    if (window.addEventListener) {
                        window.addEventListener("message", function (event) { return _this.receiveMessage(_this.deserialize(event.data), _this.userInfo); }, false);
                    }
                    else if (window.attachEvent) {
                        window.attachEvent("onmessage", function (event) { return _this.receiveMessage(_this.deserialize(event.data), _this.userInfo); });
                    }
                };
                QueueUserInfoClient.prototype.requestRefresh = function () {
                    parent.postMessage('{"messageType":"RequestRefresh"}', '*');
                };
                QueueUserInfoClient.prototype.refresh = function (json) {
                    this.receiveMessage(this.deserialize(json), this.userInfo);
                };
                return QueueUserInfoClient;
            }());
            CustomLayout.QueueUserInfoClient = QueueUserInfoClient;
            window.queueUserInfoClient = new QueueUserInfoClient();
        })(CustomLayout = Javascript.CustomLayout || (Javascript.CustomLayout = {}));
    })(Javascript = QueueIt.Javascript || (QueueIt.Javascript = {}));
})(QueueIt || (QueueIt = {}));
