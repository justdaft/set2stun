var newTiles = [
    {
        "_id": 1,
        "tileimageid": 1,
        "index": 1,
        "x": 0,
        "y": 0,
        "guid": "MuSo4kl8M0ORZbZQaRKFGA",
        "ismatched": false,
        "canflip": true,
        "isflipped": false,
        "coverid": 25
    },
    {
        "_id": 2,
        "tileimageid": 2,
        "index": 2,
        "x": 0,
        "y": 0,
        "guid": "6o0fb7U9ekq5PXbHeny5NQ",
        "ismatched": false,
        "canflip": true,
        "isflipped": false,
        "coverid": 25
    },
    {
        "_id": 3,
        "tileimageid": 3,
        "index": 3,
        "x": 0,
        "y": 0,
        "guid": "VGxzaNG5qUaMqv7cPmK_Sg",
        "ismatched": false,
        "canflip": true,
        "isflipped": false,
        "coverid": 25
    },
    {
        "_id": 4,
        "tileimageid": 4,
        "index": 4,
        "x": 0,
        "y": 0,
        "guid": "agpMhuZf4UWdaIS-EgHvsQ",
        "ismatched": false,
        "canflip": true,
        "isflipped": false,
        "coverid": 25
    },
    {
        "_id": 5,
        "tileimageid": 5,
        "index": 5,
        "x": 0,
        "y": 0,
        "guid": "pecw2bbEuUao896Rbwp1Hg",
        "ismatched": false,
        "canflip": true,
        "isflipped": false,
        "coverid": 25
    }
];

var newTile1 = {
    "_id": 6,
    "tileimageid": 6,
    "index": 6,
    "x": 0,
    "y": 0,
    "guid": "gbz2M5cB8kOhLvFtOTx3Gw",
    "ismatched": false,
    "canflip": true,
    "isflipped": false,
    "coverid": 25
};

var newTile2 = {

    "_id": 7,
    "tileimageid": 7,
    "index": 7,
    "x": 0,
    "y": 0,
    "guid": "keTYkyxXf0yGmZV3MKryXg",
    "ismatched": false,
    "canflip": true,
    "isflipped": false,
    "coverid": 25
};

var state = Immutable.Map({
    tiles: Immutable.List(),
    total: 0
})

var state1 = state.mergeDeep({
    tiles: newTiles,
    total: 3
});

// var state = state1.get('tiles').push(newTile1);
console.log('state: ', state);
console.log('----');
console.log('state1: ', state1);
console.log('----');
console.log('The tiles List object')
console.log('state1.get tiles: ', state1.get('tiles'))
console.log('as we can see here...')
// console.log(state1.get('tiles').inspect())
console.log('This returns from map')
console.log('get guids: ', state1.get('tiles').map(function (tile) {
    return tile.get('guid')
}))

console.log('state1.get(total): ', state1.get('total'))
console.log('state1.set([total, 4]): ', state1.set(['total', 4]))
console.log('state1.get(total): ', state1)
// console.log('This returns from map and is converted back to JS object')
// console.log(state1.get('tiles').map(function (o) {
//    return o.get('_id')
// }).toJS())
