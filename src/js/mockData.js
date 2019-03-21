export function getMockCategories() {
    return [{
        "name": "Commits",
        "description": "committed something",
        "color": [200, 0, 0]
    }, {
        "name": "couch",
        "description": "bought a couch today",
        "color": [0, 200, 0]
    }, {
        "name": "Climbing",
        "description": "went into the climbing gym",
        "color": [0, 200, 200]
    }
    ];
}

export function getMockCalendarData(category) {
    // Todo return activityList based on category
    let activities = [{
        "category": "couch",
        "date": "2019-03-18"
    }, {
        "category": "couch",
        "date": "2019-03-17"
    }, {
        "category": "couch",
        "date": "2019-03-01"
    }, {
        "category": "Commits",
        "date": "2019-03-15"
    }, {
        "category": "couch",
        "date": "2019-03-31"
    }, {
        "category": "couch",
        "date": "2019-03-30"
    }, {
        "category": "Climbing",
        "date": "2019-03-30"
    }];
    return activities.filter((activity) => activity.category === category);
}