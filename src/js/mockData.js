export function getMockCategories() {
    return [{
        "name": "Commits",
        "description": "committed something",
        "color": "200, 0, 0"
    }, {
        "name": "couch",
        "description": "bought a couch today",
        "color": "0, 200, 0"
    }
    ];
}

export function getMockCalendarData(category) {
    // Todo return data based on category
    return [{
        "category": "couch",
        "date": "08.03.2019"
    }]
}