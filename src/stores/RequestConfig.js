var baseURL = '##project_baseurl';

import request from 'superagent';

var requests = function(type, url, data) {
    var url = baseURL + url;
    var authToken = localStorage.getItem('##project_token') || null;

    switch (type) {
        case 'get':
            return request.get(url)
                    .set('x-jwt', authToken)
                    .set('Accept', 'application/json');
            break;
        case 'post':
            return request.post(url)
                    .set('x-jwt', authToken)
                    .set('Accept', 'application/json')
                    .send(data);
            break;
        case 'upload':
            var formData = new FormData();
            formData.append("file", data);
            return request.post(url)
                    .set('x-jwt', authToken)
                    .send(formData);
            break;
        default:

    }
};

export default requests;
