app.controller("settingsadd_list", function ($scope) {
    $scope.items = [{
        "tax": "11.5",
        "rate": "6321"},
        {
        "tax": "63.5",
        "rate": "2722"},
        {
        "tax": "6.45",
        "rate": "1432"},
        {
        "tax": "1.5",
        "rate": "1732"},
        {
        "tax": "32.5",
        "rate": "6732"},
        {
        "tax": "7.3",
        "rate": "2432"}
    ]
});

app.controller("subscription_list", function ($scope) {
    $scope.items = [{
        "date": "11.5",
        "amount": "6321",
        "remark":"Ok"
    }]
});
