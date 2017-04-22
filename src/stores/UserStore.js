import Reflux from 'reflux'
import promises from './promises';

const UserStore = Reflux.createStore({

    init: function() {
        this.data = {
            selectedArea: "JAYANAGAR"
        };
    },

    getInitialState() {
        return this.data;
    },

    setSelectedArea(area) {
        this.data.selectedArea = area;
        this.trigger(this.data);
    },

    getUser() {
        var self = this;
        return promises('get', 'user', null, function(res){
            self.data = res.body;
            self.trigger(self.data);
        }, function(err){
            self.logoutUser();
        })

    }
});

export default UserStore
