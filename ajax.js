// $.mockjax({
//     url: '/api/v1/categories',
//     responseTime: 3000,
//     dataType: 'json',
//     //proxy: 'categories.json'
//     response: function(settings) {
//         this.responseText = "[{\"CategoryId\":1,\"CategoryName\":\"All Kupons\",\"CategorySlug\":\"kupons/all\"},{\"CategoryId\":3,\"CategoryName\":\"New Kupons\",\"CategorySlug\":\"kupons/new\"},{\"CategoryId\":2,\"CategoryName\":\"Hot Kupons\",\"CategorySlug\":\"kupons/hot\"},{\"CategoryId\":5,\"CategoryName\":\"Ending Soon\",\"CategorySlug\":\"kupons/endingsoon\"},{\"CategoryId\":7,\"CategoryName\":\"Kupons by Category\",\"SubCategories\":[{\"CategoryId\":71,\"CategoryName\":\"Eat & Drink\",\"CategorySlug\":\"kupons/71/eat-and-drink\"},{\"CategoryId\":72,\"CategoryName\":\"Hobby\",\"CategorySlug\":\"kupons/72/hobby\"},{\"CategoryId\":73,\"CategoryName\":\"Travel\",\"CategorySlug\":\"kupons/73/travel\"},{\"CategoryId\":74,\"CategoryName\":\"Health & Beauty\",\"CategorySlug\":\"kupons/74/health-and-beauty\"},{\"CategoryId\":75,\"CategoryName\":\"Wedding\",\"CategorySlug\":\"kupons/75/wedding\"}]},{\"CategoryId\":4,\"CategoryName\":\"Honeymoon\",\"CategorySlug\":\"kupons/honeymoon\"}]";
//     }
// });

// $.mockjax({
//     url: '/api/v1/regions',
//     responseTime: 1000,
//     dataType: 'json',
//     //proxy: 'regions.json'
//     response: function (settings) {
//         this.responseText = "[{\"RegionId\":1,\"RegionName\":\"Jakarta\"},{\"RegionId\":2,\"RegionName\":\"Bali\"},{\"RegionId\":3,\"RegionName\":\"Tangerang\"},{\"RegionId\":4,\"RegionName\":\"Bandung\"},{\"RegionId\":5,\"RegionName\":\"Jogjakarta\"},{\"RegionId\":6,\"RegionName\":\"Surabaya\"}]";
//     }
// });

// $.mockjax({
//     url: '/api/v1/deals',
//     responseTime: 4000,
//     dataType: 'json',
//     //proxy: 'deals.json'
//     response: function (settings) {
//         this.responseText = "[{\"DealId\":1,\"DealName\":\"Deal 1\"},{\"DealId\":2,\"DealName\":\"Deal 2\"},{\"DealId\":3,\"DealName\":\"Deal 3\"},{\"DealId\":4,\"DealName\":\"Deal 4\"},{\"DealId\":5,\"DealName\":\"Deal 5\"},{\"DealId\":6,\"DealName\":\"Deal 6\"},{\"DealId\":7,\"DealName\":\"Deal 7\"}]";
//     }
// });

$.mockjax({
    url: '/api/v1/cart',
    responseTime: 0,
    dataType: 'json',
    proxy: '/json/cart.json'
});

