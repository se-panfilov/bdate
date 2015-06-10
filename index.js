'use strict';

angular.module('demo', [
    'bdate'
])

    .controller('DemoPageCtrl', function ($scope, $timeout) {

        $scope.demoData = {
            "format": "dd.MM.yyyy",
            "delimiter": ".",
            "today": {
                "date": 1433817417,
                "year": 2015,
                "month": 6,
                "day": 9,
                "day_of_week": 2
            },
            "years": {
                "2013": {
                    "1": {
                        "days_total": 31,
                        "start_day": 2
                    }
                },
                "2014": {
                    "5": {
                        "days_total": 31,
                        "start_day": 4
                    },
                    "6": {
                        "days_total": 30,
                        "start_day": 7
                    },
                    "7": {
                        "days_total": 31,
                        "start_day": 2
                    },
                    "8": {
                        "days_total": 31,
                        "start_day": 5
                    },
                    "9": {
                        "days_total": 30,
                        "start_day": 1
                    },
                    "10": {
                        "days_total": 31,
                        "start_day": 3
                    }
                },
                "2015": {
                    "2": {
                        "days_total": 28,
                        "start_day": 7
                    },
                    "3": {
                        "days_total": 31,
                        "start_day": 5
                    },
                    "4": {
                        "days_total": 30,
                        "start_day": 3
                    },
                    "5": {
                        "days_total": 31,
                        "start_day": 5
                    }
                },
                "2016": {
                    "1": {
                        "days_total": 31,
                        "start_day": 5
                    }
                },
                "2017": {
                    "1": {
                        "days_total": 31,
                        "start_day": 7
                    },
                    "2": {
                        "days_total": 28,
                        "start_day": 3
                    }
                }
            }
        };

        $scope.bigDemoData = {
            "delimiter": "-",
            "years": {
                "1950": {
                    "1": {"days_total": 31, "start_day": 7},
                    "2": {"days_total": 28, "start_day": 3},
                    "3": {"days_total": 31, "start_day": 3},
                    "4": {"days_total": 30, "start_day": 6},
                    "5": {"days_total": 31, "start_day": 1},
                    "6": {"days_total": 30, "start_day": 4},
                    "7": {"days_total": 31, "start_day": 6},
                    "8": {"days_total": 31, "start_day": 2},
                    "9": {"days_total": 30, "start_day": 5},
                    "10": {"days_total": 31, "start_day": 7},
                    "11": {"days_total": 30, "start_day": 3},
                    "12": {"days_total": 31, "start_day": 5}
                },
                "1951": {
                    "1": {"days_total": 31, "start_day": 1},
                    "2": {"days_total": 28, "start_day": 4},
                    "3": {"days_total": 31, "start_day": 4},
                    "4": {"days_total": 30, "start_day": 7},
                    "5": {"days_total": 31, "start_day": 2},
                    "6": {"days_total": 30, "start_day": 5},
                    "7": {"days_total": 31, "start_day": 7},
                    "8": {"days_total": 31, "start_day": 3},
                    "9": {"days_total": 30, "start_day": 6},
                    "10": {"days_total": 31, "start_day": 1},
                    "11": {"days_total": 30, "start_day": 4},
                    "12": {"days_total": 31, "start_day": 6}
                },
                "1952": {
                    "1": {"days_total": 31, "start_day": 2},
                    "2": {"days_total": 29, "start_day": 5},
                    "3": {"days_total": 31, "start_day": 6},
                    "4": {"days_total": 30, "start_day": 2},
                    "5": {"days_total": 31, "start_day": 4},
                    "6": {"days_total": 30, "start_day": 7},
                    "7": {"days_total": 31, "start_day": 2},
                    "8": {"days_total": 31, "start_day": 5},
                    "9": {"days_total": 30, "start_day": 1},
                    "10": {"days_total": 31, "start_day": 3},
                    "11": {"days_total": 30, "start_day": 6},
                    "12": {"days_total": 31, "start_day": 1}
                },
                "1953": {
                    "1": {"days_total": 31, "start_day": 4},
                    "2": {"days_total": 28, "start_day": 7},
                    "3": {"days_total": 31, "start_day": 7},
                    "4": {"days_total": 30, "start_day": 3},
                    "5": {"days_total": 31, "start_day": 5},
                    "6": {"days_total": 30, "start_day": 1},
                    "7": {"days_total": 31, "start_day": 3},
                    "8": {"days_total": 31, "start_day": 6},
                    "9": {"days_total": 30, "start_day": 2},
                    "10": {"days_total": 31, "start_day": 4},
                    "11": {"days_total": 30, "start_day": 7},
                    "12": {"days_total": 31, "start_day": 2}
                },
                "1954": {
                    "1": {"days_total": 31, "start_day": 5},
                    "2": {"days_total": 28, "start_day": 1},
                    "3": {"days_total": 31, "start_day": 1},
                    "4": {"days_total": 30, "start_day": 4},
                    "5": {"days_total": 31, "start_day": 6},
                    "6": {"days_total": 30, "start_day": 2},
                    "7": {"days_total": 31, "start_day": 4},
                    "8": {"days_total": 31, "start_day": 7},
                    "9": {"days_total": 30, "start_day": 3},
                    "10": {"days_total": 31, "start_day": 5},
                    "11": {"days_total": 30, "start_day": 1},
                    "12": {"days_total": 31, "start_day": 3}
                },
                "1955": {
                    "1": {"days_total": 31, "start_day": 6},
                    "2": {"days_total": 28, "start_day": 2},
                    "3": {"days_total": 31, "start_day": 2},
                    "4": {"days_total": 30, "start_day": 5},
                    "5": {"days_total": 31, "start_day": 7},
                    "6": {"days_total": 30, "start_day": 3},
                    "7": {"days_total": 31, "start_day": 5},
                    "8": {"days_total": 31, "start_day": 1},
                    "9": {"days_total": 30, "start_day": 4},
                    "10": {"days_total": 31, "start_day": 6},
                    "11": {"days_total": 30, "start_day": 2},
                    "12": {"days_total": 31, "start_day": 4}
                },
                "1956": {
                    "1": {"days_total": 31, "start_day": 7},
                    "2": {"days_total": 29, "start_day": 3},
                    "3": {"days_total": 31, "start_day": 4},
                    "4": {"days_total": 30, "start_day": 7},
                    "5": {"days_total": 31, "start_day": 2},
                    "6": {"days_total": 30, "start_day": 5},
                    "7": {"days_total": 31, "start_day": 7},
                    "8": {"days_total": 31, "start_day": 3},
                    "9": {"days_total": 30, "start_day": 6},
                    "10": {"days_total": 31, "start_day": 1},
                    "11": {"days_total": 30, "start_day": 4},
                    "12": {"days_total": 31, "start_day": 6}
                },
                "1957": {
                    "1": {"days_total": 31, "start_day": 2},
                    "2": {"days_total": 28, "start_day": 5},
                    "3": {"days_total": 31, "start_day": 5},
                    "4": {"days_total": 30, "start_day": 1},
                    "5": {"days_total": 31, "start_day": 3},
                    "6": {"days_total": 30, "start_day": 6},
                    "7": {"days_total": 31, "start_day": 1},
                    "8": {"days_total": 31, "start_day": 4},
                    "9": {"days_total": 30, "start_day": 7},
                    "10": {"days_total": 31, "start_day": 2},
                    "11": {"days_total": 30, "start_day": 5},
                    "12": {"days_total": 31, "start_day": 7}
                },
                "1958": {
                    "1": {"days_total": 31, "start_day": 3},
                    "2": {"days_total": 28, "start_day": 6},
                    "3": {"days_total": 31, "start_day": 6},
                    "4": {"days_total": 30, "start_day": 2},
                    "5": {"days_total": 31, "start_day": 4},
                    "6": {"days_total": 30, "start_day": 7},
                    "7": {"days_total": 31, "start_day": 2},
                    "8": {"days_total": 31, "start_day": 5},
                    "9": {"days_total": 30, "start_day": 1},
                    "10": {"days_total": 31, "start_day": 3},
                    "11": {"days_total": 30, "start_day": 6},
                    "12": {"days_total": 31, "start_day": 1}
                },
                "1959": {
                    "1": {"days_total": 31, "start_day": 4},
                    "2": {"days_total": 28, "start_day": 7},
                    "3": {"days_total": 31, "start_day": 7},
                    "4": {"days_total": 30, "start_day": 3},
                    "5": {"days_total": 31, "start_day": 5},
                    "6": {"days_total": 30, "start_day": 1},
                    "7": {"days_total": 31, "start_day": 3},
                    "8": {"days_total": 31, "start_day": 6},
                    "9": {"days_total": 30, "start_day": 2},
                    "10": {"days_total": 31, "start_day": 4},
                    "11": {"days_total": 30, "start_day": 7},
                    "12": {"days_total": 31, "start_day": 2}
                },
                "1960": {
                    "1": {"days_total": 31, "start_day": 5},
                    "2": {"days_total": 29, "start_day": 1},
                    "3": {"days_total": 31, "start_day": 2},
                    "4": {"days_total": 30, "start_day": 5},
                    "5": {"days_total": 31, "start_day": 7},
                    "6": {"days_total": 30, "start_day": 3},
                    "7": {"days_total": 31, "start_day": 5},
                    "8": {"days_total": 31, "start_day": 1},
                    "9": {"days_total": 30, "start_day": 4},
                    "10": {"days_total": 31, "start_day": 6},
                    "11": {"days_total": 30, "start_day": 2},
                    "12": {"days_total": 31, "start_day": 4}
                },
                "1961": {
                    "1": {"days_total": 31, "start_day": 7},
                    "2": {"days_total": 28, "start_day": 3},
                    "3": {"days_total": 31, "start_day": 3},
                    "4": {"days_total": 30, "start_day": 6},
                    "5": {"days_total": 31, "start_day": 1},
                    "6": {"days_total": 30, "start_day": 4},
                    "7": {"days_total": 31, "start_day": 6},
                    "8": {"days_total": 31, "start_day": 2},
                    "9": {"days_total": 30, "start_day": 5},
                    "10": {"days_total": 31, "start_day": 7},
                    "11": {"days_total": 30, "start_day": 3},
                    "12": {"days_total": 31, "start_day": 5}
                },
                "1962": {
                    "1": {"days_total": 31, "start_day": 1},
                    "2": {"days_total": 28, "start_day": 4},
                    "3": {"days_total": 31, "start_day": 4},
                    "4": {"days_total": 30, "start_day": 7},
                    "5": {"days_total": 31, "start_day": 2},
                    "6": {"days_total": 30, "start_day": 5},
                    "7": {"days_total": 31, "start_day": 7},
                    "8": {"days_total": 31, "start_day": 3},
                    "9": {"days_total": 30, "start_day": 6},
                    "10": {"days_total": 31, "start_day": 1},
                    "11": {"days_total": 30, "start_day": 4},
                    "12": {"days_total": 31, "start_day": 6}
                },
                "1963": {
                    "1": {"days_total": 31, "start_day": 2},
                    "2": {"days_total": 28, "start_day": 5},
                    "3": {"days_total": 31, "start_day": 5},
                    "4": {"days_total": 30, "start_day": 1},
                    "5": {"days_total": 31, "start_day": 3},
                    "6": {"days_total": 30, "start_day": 6},
                    "7": {"days_total": 31, "start_day": 1},
                    "8": {"days_total": 31, "start_day": 4},
                    "9": {"days_total": 30, "start_day": 7},
                    "10": {"days_total": 31, "start_day": 2},
                    "11": {"days_total": 30, "start_day": 5},
                    "12": {"days_total": 31, "start_day": 7}
                },
                "1964": {
                    "1": {"days_total": 31, "start_day": 3},
                    "2": {"days_total": 29, "start_day": 6},
                    "3": {"days_total": 31, "start_day": 7},
                    "4": {"days_total": 30, "start_day": 3},
                    "5": {"days_total": 31, "start_day": 5},
                    "6": {"days_total": 30, "start_day": 1},
                    "7": {"days_total": 31, "start_day": 3},
                    "8": {"days_total": 31, "start_day": 6},
                    "9": {"days_total": 30, "start_day": 2},
                    "10": {"days_total": 31, "start_day": 4},
                    "11": {"days_total": 30, "start_day": 7},
                    "12": {"days_total": 31, "start_day": 2}
                },
                "1965": {
                    "1": {"days_total": 31, "start_day": 5},
                    "2": {"days_total": 28, "start_day": 1},
                    "3": {"days_total": 31, "start_day": 1},
                    "4": {"days_total": 30, "start_day": 4},
                    "5": {"days_total": 31, "start_day": 6},
                    "6": {"days_total": 30, "start_day": 2},
                    "7": {"days_total": 31, "start_day": 4},
                    "8": {"days_total": 31, "start_day": 7},
                    "9": {"days_total": 30, "start_day": 3},
                    "10": {"days_total": 31, "start_day": 5},
                    "11": {"days_total": 30, "start_day": 1},
                    "12": {"days_total": 31, "start_day": 3}
                },
                "1966": {
                    "1": {"days_total": 31, "start_day": 6},
                    "2": {"days_total": 28, "start_day": 2},
                    "3": {"days_total": 31, "start_day": 2},
                    "4": {"days_total": 30, "start_day": 5},
                    "5": {"days_total": 31, "start_day": 7},
                    "6": {"days_total": 30, "start_day": 3},
                    "7": {"days_total": 31, "start_day": 5},
                    "8": {"days_total": 31, "start_day": 1},
                    "9": {"days_total": 30, "start_day": 4},
                    "10": {"days_total": 31, "start_day": 6},
                    "11": {"days_total": 30, "start_day": 2},
                    "12": {"days_total": 31, "start_day": 4}
                },
                "1967": {
                    "1": {"days_total": 31, "start_day": 7},
                    "2": {"days_total": 28, "start_day": 3},
                    "3": {"days_total": 31, "start_day": 3},
                    "4": {"days_total": 30, "start_day": 6},
                    "5": {"days_total": 31, "start_day": 1},
                    "6": {"days_total": 30, "start_day": 4},
                    "7": {"days_total": 31, "start_day": 6},
                    "8": {"days_total": 31, "start_day": 2},
                    "9": {"days_total": 30, "start_day": 5},
                    "10": {"days_total": 31, "start_day": 7},
                    "11": {"days_total": 30, "start_day": 3},
                    "12": {"days_total": 31, "start_day": 5}
                },
                "1968": {
                    "1": {"days_total": 31, "start_day": 1},
                    "2": {"days_total": 29, "start_day": 4},
                    "3": {"days_total": 31, "start_day": 5},
                    "4": {"days_total": 30, "start_day": 1},
                    "5": {"days_total": 31, "start_day": 3},
                    "6": {"days_total": 30, "start_day": 6},
                    "7": {"days_total": 31, "start_day": 1},
                    "8": {"days_total": 31, "start_day": 4},
                    "9": {"days_total": 30, "start_day": 7},
                    "10": {"days_total": 31, "start_day": 2},
                    "11": {"days_total": 30, "start_day": 5},
                    "12": {"days_total": 31, "start_day": 7}
                },
                "1969": {
                    "1": {"days_total": 31, "start_day": 3},
                    "2": {"days_total": 28, "start_day": 6},
                    "3": {"days_total": 31, "start_day": 6},
                    "4": {"days_total": 30, "start_day": 2},
                    "5": {"days_total": 31, "start_day": 4},
                    "6": {"days_total": 30, "start_day": 7},
                    "7": {"days_total": 31, "start_day": 2},
                    "8": {"days_total": 31, "start_day": 5},
                    "9": {"days_total": 30, "start_day": 1},
                    "10": {"days_total": 31, "start_day": 3},
                    "11": {"days_total": 30, "start_day": 6},
                    "12": {"days_total": 31, "start_day": 1}
                },
                "1970": {
                    "1": {"days_total": 31, "start_day": 4},
                    "2": {"days_total": 28, "start_day": 7},
                    "3": {"days_total": 31, "start_day": 7},
                    "4": {"days_total": 30, "start_day": 3},
                    "5": {"days_total": 31, "start_day": 5},
                    "6": {"days_total": 30, "start_day": 1},
                    "7": {"days_total": 31, "start_day": 3},
                    "8": {"days_total": 31, "start_day": 6},
                    "9": {"days_total": 30, "start_day": 2},
                    "10": {"days_total": 31, "start_day": 4},
                    "11": {"days_total": 30, "start_day": 7},
                    "12": {"days_total": 31, "start_day": 2}
                },
                "1971": {
                    "1": {"days_total": 31, "start_day": 5},
                    "2": {"days_total": 28, "start_day": 1},
                    "3": {"days_total": 31, "start_day": 1},
                    "4": {"days_total": 30, "start_day": 4},
                    "5": {"days_total": 31, "start_day": 6},
                    "6": {"days_total": 30, "start_day": 2},
                    "7": {"days_total": 31, "start_day": 4},
                    "8": {"days_total": 31, "start_day": 7},
                    "9": {"days_total": 30, "start_day": 3},
                    "10": {"days_total": 31, "start_day": 5},
                    "11": {"days_total": 30, "start_day": 1},
                    "12": {"days_total": 31, "start_day": 3}
                },
                "1972": {
                    "1": {"days_total": 31, "start_day": 6},
                    "2": {"days_total": 29, "start_day": 2},
                    "3": {"days_total": 31, "start_day": 3},
                    "4": {"days_total": 30, "start_day": 6},
                    "5": {"days_total": 31, "start_day": 1},
                    "6": {"days_total": 30, "start_day": 4},
                    "7": {"days_total": 31, "start_day": 6},
                    "8": {"days_total": 31, "start_day": 2},
                    "9": {"days_total": 30, "start_day": 5},
                    "10": {"days_total": 31, "start_day": 7},
                    "11": {"days_total": 30, "start_day": 3},
                    "12": {"days_total": 31, "start_day": 5}
                },
                "1973": {
                    "1": {"days_total": 31, "start_day": 1},
                    "2": {"days_total": 28, "start_day": 4},
                    "3": {"days_total": 31, "start_day": 4},
                    "4": {"days_total": 30, "start_day": 7},
                    "5": {"days_total": 31, "start_day": 2},
                    "6": {"days_total": 30, "start_day": 5},
                    "7": {"days_total": 31, "start_day": 7},
                    "8": {"days_total": 31, "start_day": 3},
                    "9": {"days_total": 30, "start_day": 6},
                    "10": {"days_total": 31, "start_day": 1},
                    "11": {"days_total": 30, "start_day": 4},
                    "12": {"days_total": 31, "start_day": 6}
                },
                "1974": {
                    "1": {"days_total": 31, "start_day": 2},
                    "2": {"days_total": 28, "start_day": 5},
                    "3": {"days_total": 31, "start_day": 5},
                    "4": {"days_total": 30, "start_day": 1},
                    "5": {"days_total": 31, "start_day": 3},
                    "6": {"days_total": 30, "start_day": 6},
                    "7": {"days_total": 31, "start_day": 1},
                    "8": {"days_total": 31, "start_day": 4},
                    "9": {"days_total": 30, "start_day": 7},
                    "10": {"days_total": 31, "start_day": 2},
                    "11": {"days_total": 30, "start_day": 5},
                    "12": {"days_total": 31, "start_day": 7}
                },
                "1975": {
                    "1": {"days_total": 31, "start_day": 3},
                    "2": {"days_total": 28, "start_day": 6},
                    "3": {"days_total": 31, "start_day": 6},
                    "4": {"days_total": 30, "start_day": 2},
                    "5": {"days_total": 31, "start_day": 4},
                    "6": {"days_total": 30, "start_day": 7},
                    "7": {"days_total": 31, "start_day": 2},
                    "8": {"days_total": 31, "start_day": 5},
                    "9": {"days_total": 30, "start_day": 1},
                    "10": {"days_total": 31, "start_day": 3},
                    "11": {"days_total": 30, "start_day": 6},
                    "12": {"days_total": 31, "start_day": 1}
                },
                "1976": {
                    "1": {"days_total": 31, "start_day": 4},
                    "2": {"days_total": 29, "start_day": 7},
                    "3": {"days_total": 31, "start_day": 1},
                    "4": {"days_total": 30, "start_day": 4},
                    "5": {"days_total": 31, "start_day": 6},
                    "6": {"days_total": 30, "start_day": 2},
                    "7": {"days_total": 31, "start_day": 4},
                    "8": {"days_total": 31, "start_day": 7},
                    "9": {"days_total": 30, "start_day": 3},
                    "10": {"days_total": 31, "start_day": 5},
                    "11": {"days_total": 30, "start_day": 1},
                    "12": {"days_total": 31, "start_day": 3}
                },
                "1977": {
                    "1": {"days_total": 31, "start_day": 6},
                    "2": {"days_total": 28, "start_day": 2},
                    "3": {"days_total": 31, "start_day": 2},
                    "4": {"days_total": 30, "start_day": 5},
                    "5": {"days_total": 31, "start_day": 7},
                    "6": {"days_total": 30, "start_day": 3},
                    "7": {"days_total": 31, "start_day": 5},
                    "8": {"days_total": 31, "start_day": 1},
                    "9": {"days_total": 30, "start_day": 4},
                    "10": {"days_total": 31, "start_day": 6},
                    "11": {"days_total": 30, "start_day": 2},
                    "12": {"days_total": 31, "start_day": 4}
                },
                "1978": {
                    "1": {"days_total": 31, "start_day": 7},
                    "2": {"days_total": 28, "start_day": 3},
                    "3": {"days_total": 31, "start_day": 3},
                    "4": {"days_total": 30, "start_day": 6},
                    "5": {"days_total": 31, "start_day": 1},
                    "6": {"days_total": 30, "start_day": 4},
                    "7": {"days_total": 31, "start_day": 6},
                    "8": {"days_total": 31, "start_day": 2},
                    "9": {"days_total": 30, "start_day": 5},
                    "10": {"days_total": 31, "start_day": 7},
                    "11": {"days_total": 30, "start_day": 3},
                    "12": {"days_total": 31, "start_day": 5}
                },
                "1979": {
                    "1": {"days_total": 31, "start_day": 1},
                    "2": {"days_total": 28, "start_day": 4},
                    "3": {"days_total": 31, "start_day": 4},
                    "4": {"days_total": 30, "start_day": 7},
                    "5": {"days_total": 31, "start_day": 2},
                    "6": {"days_total": 30, "start_day": 5},
                    "7": {"days_total": 31, "start_day": 7},
                    "8": {"days_total": 31, "start_day": 3},
                    "9": {"days_total": 30, "start_day": 6},
                    "10": {"days_total": 31, "start_day": 1},
                    "11": {"days_total": 30, "start_day": 4},
                    "12": {"days_total": 31, "start_day": 6}
                },
                "1980": {
                    "1": {"days_total": 31, "start_day": 2},
                    "2": {"days_total": 29, "start_day": 5},
                    "3": {"days_total": 31, "start_day": 6},
                    "4": {"days_total": 30, "start_day": 2},
                    "5": {"days_total": 31, "start_day": 4},
                    "6": {"days_total": 30, "start_day": 7},
                    "7": {"days_total": 31, "start_day": 2},
                    "8": {"days_total": 31, "start_day": 5},
                    "9": {"days_total": 30, "start_day": 1},
                    "10": {"days_total": 31, "start_day": 3},
                    "11": {"days_total": 30, "start_day": 6},
                    "12": {"days_total": 31, "start_day": 1}
                },
                "1981": {
                    "1": {"days_total": 31, "start_day": 4},
                    "2": {"days_total": 28, "start_day": 7},
                    "3": {"days_total": 31, "start_day": 7},
                    "4": {"days_total": 30, "start_day": 3},
                    "5": {"days_total": 31, "start_day": 5},
                    "6": {"days_total": 30, "start_day": 1},
                    "7": {"days_total": 31, "start_day": 3},
                    "8": {"days_total": 31, "start_day": 6},
                    "9": {"days_total": 30, "start_day": 2},
                    "10": {"days_total": 31, "start_day": 4},
                    "11": {"days_total": 30, "start_day": 7},
                    "12": {"days_total": 31, "start_day": 2}
                },
                "1982": {
                    "1": {"days_total": 31, "start_day": 5},
                    "2": {"days_total": 28, "start_day": 1},
                    "3": {"days_total": 31, "start_day": 1},
                    "4": {"days_total": 30, "start_day": 4},
                    "5": {"days_total": 31, "start_day": 6},
                    "6": {"days_total": 30, "start_day": 2},
                    "7": {"days_total": 31, "start_day": 4},
                    "8": {"days_total": 31, "start_day": 7},
                    "9": {"days_total": 30, "start_day": 3},
                    "10": {"days_total": 31, "start_day": 5},
                    "11": {"days_total": 30, "start_day": 1},
                    "12": {"days_total": 31, "start_day": 3}
                },
                "1983": {
                    "1": {"days_total": 31, "start_day": 6},
                    "2": {"days_total": 28, "start_day": 2},
                    "3": {"days_total": 31, "start_day": 2},
                    "4": {"days_total": 30, "start_day": 5},
                    "5": {"days_total": 31, "start_day": 7},
                    "6": {"days_total": 30, "start_day": 3},
                    "7": {"days_total": 31, "start_day": 5},
                    "8": {"days_total": 31, "start_day": 1},
                    "9": {"days_total": 30, "start_day": 4},
                    "10": {"days_total": 31, "start_day": 6},
                    "11": {"days_total": 30, "start_day": 2},
                    "12": {"days_total": 31, "start_day": 4}
                },
                "1984": {
                    "1": {"days_total": 31, "start_day": 7},
                    "2": {"days_total": 29, "start_day": 3},
                    "3": {"days_total": 31, "start_day": 4},
                    "4": {"days_total": 30, "start_day": 7},
                    "5": {"days_total": 31, "start_day": 2},
                    "6": {"days_total": 30, "start_day": 5},
                    "7": {"days_total": 31, "start_day": 7},
                    "8": {"days_total": 31, "start_day": 3},
                    "9": {"days_total": 30, "start_day": 6},
                    "10": {"days_total": 31, "start_day": 1},
                    "11": {"days_total": 30, "start_day": 4},
                    "12": {"days_total": 31, "start_day": 6}
                },
                "1985": {
                    "1": {"days_total": 31, "start_day": 2},
                    "2": {"days_total": 28, "start_day": 5},
                    "3": {"days_total": 31, "start_day": 5},
                    "4": {"days_total": 30, "start_day": 1},
                    "5": {"days_total": 31, "start_day": 3},
                    "6": {"days_total": 30, "start_day": 6},
                    "7": {"days_total": 31, "start_day": 1},
                    "8": {"days_total": 31, "start_day": 4},
                    "9": {"days_total": 30, "start_day": 7},
                    "10": {"days_total": 31, "start_day": 2},
                    "11": {"days_total": 30, "start_day": 5},
                    "12": {"days_total": 31, "start_day": 7}
                },
                "1986": {
                    "1": {"days_total": 31, "start_day": 3},
                    "2": {"days_total": 28, "start_day": 6},
                    "3": {"days_total": 31, "start_day": 6},
                    "4": {"days_total": 30, "start_day": 2},
                    "5": {"days_total": 31, "start_day": 4},
                    "6": {"days_total": 30, "start_day": 7},
                    "7": {"days_total": 31, "start_day": 2},
                    "8": {"days_total": 31, "start_day": 5},
                    "9": {"days_total": 30, "start_day": 1},
                    "10": {"days_total": 31, "start_day": 3},
                    "11": {"days_total": 30, "start_day": 6},
                    "12": {"days_total": 31, "start_day": 1}
                },
                "1987": {
                    "1": {"days_total": 31, "start_day": 4},
                    "2": {"days_total": 28, "start_day": 7},
                    "3": {"days_total": 31, "start_day": 7},
                    "4": {"days_total": 30, "start_day": 3},
                    "5": {"days_total": 31, "start_day": 5},
                    "6": {"days_total": 30, "start_day": 1},
                    "7": {"days_total": 31, "start_day": 3},
                    "8": {"days_total": 31, "start_day": 6},
                    "9": {"days_total": 30, "start_day": 2},
                    "10": {"days_total": 31, "start_day": 4},
                    "11": {"days_total": 30, "start_day": 7},
                    "12": {"days_total": 31, "start_day": 2}
                },
                "1988": {
                    "1": {"days_total": 31, "start_day": 5},
                    "2": {"days_total": 29, "start_day": 1},
                    "3": {"days_total": 31, "start_day": 2},
                    "4": {"days_total": 30, "start_day": 5},
                    "5": {"days_total": 31, "start_day": 7},
                    "6": {"days_total": 30, "start_day": 3},
                    "7": {"days_total": 31, "start_day": 5},
                    "8": {"days_total": 31, "start_day": 1},
                    "9": {"days_total": 30, "start_day": 4},
                    "10": {"days_total": 31, "start_day": 6},
                    "11": {"days_total": 30, "start_day": 2},
                    "12": {"days_total": 31, "start_day": 4}
                },
                "1989": {
                    "1": {"days_total": 31, "start_day": 7},
                    "2": {"days_total": 28, "start_day": 3},
                    "3": {"days_total": 31, "start_day": 3},
                    "4": {"days_total": 30, "start_day": 6},
                    "5": {"days_total": 31, "start_day": 1},
                    "6": {"days_total": 30, "start_day": 4},
                    "7": {"days_total": 31, "start_day": 6},
                    "8": {"days_total": 31, "start_day": 2},
                    "9": {"days_total": 30, "start_day": 5},
                    "10": {"days_total": 31, "start_day": 7},
                    "11": {"days_total": 30, "start_day": 3},
                    "12": {"days_total": 31, "start_day": 5}
                },
                "1990": {
                    "1": {"days_total": 31, "start_day": 1},
                    "2": {"days_total": 28, "start_day": 4},
                    "3": {"days_total": 31, "start_day": 4},
                    "4": {"days_total": 30, "start_day": 7},
                    "5": {"days_total": 31, "start_day": 2},
                    "6": {"days_total": 30, "start_day": 5},
                    "7": {"days_total": 31, "start_day": 7},
                    "8": {"days_total": 31, "start_day": 3},
                    "9": {"days_total": 30, "start_day": 6},
                    "10": {"days_total": 31, "start_day": 1},
                    "11": {"days_total": 30, "start_day": 4},
                    "12": {"days_total": 31, "start_day": 6}
                },
                "1991": {
                    "1": {"days_total": 31, "start_day": 2},
                    "2": {"days_total": 28, "start_day": 5},
                    "3": {"days_total": 31, "start_day": 5},
                    "4": {"days_total": 30, "start_day": 1},
                    "5": {"days_total": 31, "start_day": 3},
                    "6": {"days_total": 30, "start_day": 6},
                    "7": {"days_total": 31, "start_day": 1},
                    "8": {"days_total": 31, "start_day": 4},
                    "9": {"days_total": 30, "start_day": 7},
                    "10": {"days_total": 31, "start_day": 2},
                    "11": {"days_total": 30, "start_day": 5},
                    "12": {"days_total": 31, "start_day": 7}
                },
                "1992": {
                    "1": {"days_total": 31, "start_day": 3},
                    "2": {"days_total": 29, "start_day": 6},
                    "3": {"days_total": 31, "start_day": 7},
                    "4": {"days_total": 30, "start_day": 3},
                    "5": {"days_total": 31, "start_day": 5},
                    "6": {"days_total": 30, "start_day": 1},
                    "7": {"days_total": 31, "start_day": 3},
                    "8": {"days_total": 31, "start_day": 6},
                    "9": {"days_total": 30, "start_day": 2},
                    "10": {"days_total": 31, "start_day": 4},
                    "11": {"days_total": 30, "start_day": 7},
                    "12": {"days_total": 31, "start_day": 2}
                },
                "1993": {
                    "1": {"days_total": 31, "start_day": 5},
                    "2": {"days_total": 28, "start_day": 1},
                    "3": {"days_total": 31, "start_day": 1},
                    "4": {"days_total": 30, "start_day": 4},
                    "5": {"days_total": 31, "start_day": 6},
                    "6": {"days_total": 30, "start_day": 2},
                    "7": {"days_total": 31, "start_day": 4},
                    "8": {"days_total": 31, "start_day": 7},
                    "9": {"days_total": 30, "start_day": 3},
                    "10": {"days_total": 31, "start_day": 5},
                    "11": {"days_total": 30, "start_day": 1},
                    "12": {"days_total": 31, "start_day": 3}
                },
                "1994": {
                    "1": {"days_total": 31, "start_day": 6},
                    "2": {"days_total": 28, "start_day": 2},
                    "3": {"days_total": 31, "start_day": 2},
                    "4": {"days_total": 30, "start_day": 5},
                    "5": {"days_total": 31, "start_day": 7},
                    "6": {"days_total": 30, "start_day": 3},
                    "7": {"days_total": 31, "start_day": 5},
                    "8": {"days_total": 31, "start_day": 1},
                    "9": {"days_total": 30, "start_day": 4},
                    "10": {"days_total": 31, "start_day": 6},
                    "11": {"days_total": 30, "start_day": 2},
                    "12": {"days_total": 31, "start_day": 4}
                },
                "1995": {
                    "1": {"days_total": 31, "start_day": 7},
                    "2": {"days_total": 28, "start_day": 3},
                    "3": {"days_total": 31, "start_day": 3},
                    "4": {"days_total": 30, "start_day": 6},
                    "5": {"days_total": 31, "start_day": 1},
                    "6": {"days_total": 30, "start_day": 4},
                    "7": {"days_total": 31, "start_day": 6},
                    "8": {"days_total": 31, "start_day": 2},
                    "9": {"days_total": 30, "start_day": 5},
                    "10": {"days_total": 31, "start_day": 7},
                    "11": {"days_total": 30, "start_day": 3},
                    "12": {"days_total": 31, "start_day": 5}
                },
                "1996": {
                    "1": {"days_total": 31, "start_day": 1},
                    "2": {"days_total": 29, "start_day": 4},
                    "3": {"days_total": 31, "start_day": 5},
                    "4": {"days_total": 30, "start_day": 1},
                    "5": {"days_total": 31, "start_day": 3},
                    "6": {"days_total": 30, "start_day": 6},
                    "7": {"days_total": 31, "start_day": 1},
                    "8": {"days_total": 31, "start_day": 4},
                    "9": {"days_total": 30, "start_day": 7},
                    "10": {"days_total": 31, "start_day": 2},
                    "11": {"days_total": 30, "start_day": 5},
                    "12": {"days_total": 31, "start_day": 7}
                },
                "1997": {
                    "1": {"days_total": 31, "start_day": 3},
                    "2": {"days_total": 28, "start_day": 6},
                    "3": {"days_total": 31, "start_day": 6},
                    "4": {"days_total": 30, "start_day": 2},
                    "5": {"days_total": 31, "start_day": 4},
                    "6": {"days_total": 30, "start_day": 7},
                    "7": {"days_total": 31, "start_day": 2},
                    "8": {"days_total": 31, "start_day": 5},
                    "9": {"days_total": 30, "start_day": 1},
                    "10": {"days_total": 31, "start_day": 3},
                    "11": {"days_total": 30, "start_day": 6},
                    "12": {"days_total": 31, "start_day": 1}
                },
                "1998": {
                    "1": {"days_total": 31, "start_day": 4},
                    "2": {"days_total": 28, "start_day": 7},
                    "3": {"days_total": 31, "start_day": 7},
                    "4": {"days_total": 30, "start_day": 3},
                    "5": {"days_total": 31, "start_day": 5},
                    "6": {"days_total": 30, "start_day": 1},
                    "7": {"days_total": 31, "start_day": 3},
                    "8": {"days_total": 31, "start_day": 6},
                    "9": {"days_total": 30, "start_day": 2},
                    "10": {"days_total": 31, "start_day": 4},
                    "11": {"days_total": 30, "start_day": 7},
                    "12": {"days_total": 31, "start_day": 2}
                },
                "1999": {
                    "1": {"days_total": 31, "start_day": 5},
                    "2": {"days_total": 28, "start_day": 1},
                    "3": {"days_total": 31, "start_day": 1},
                    "4": {"days_total": 30, "start_day": 4},
                    "5": {"days_total": 31, "start_day": 6},
                    "6": {"days_total": 30, "start_day": 2},
                    "7": {"days_total": 31, "start_day": 4},
                    "8": {"days_total": 31, "start_day": 7},
                    "9": {"days_total": 30, "start_day": 3},
                    "10": {"days_total": 31, "start_day": 5},
                    "11": {"days_total": 30, "start_day": 1},
                    "12": {"days_total": 31, "start_day": 3}
                },
                "2000": {
                    "1": {"days_total": 31, "start_day": 6},
                    "2": {"days_total": 29, "start_day": 2},
                    "3": {"days_total": 31, "start_day": 3},
                    "4": {"days_total": 30, "start_day": 6},
                    "5": {"days_total": 31, "start_day": 1},
                    "6": {"days_total": 30, "start_day": 4},
                    "7": {"days_total": 31, "start_day": 6},
                    "8": {"days_total": 31, "start_day": 2},
                    "9": {"days_total": 30, "start_day": 5},
                    "10": {"days_total": 31, "start_day": 7},
                    "11": {"days_total": 30, "start_day": 3},
                    "12": {"days_total": 31, "start_day": 5}
                },
                "2001": {
                    "1": {"days_total": 31, "start_day": 1},
                    "2": {"days_total": 28, "start_day": 4},
                    "3": {"days_total": 31, "start_day": 4},
                    "4": {"days_total": 30, "start_day": 7},
                    "5": {"days_total": 31, "start_day": 2},
                    "6": {"days_total": 30, "start_day": 5},
                    "7": {"days_total": 31, "start_day": 7},
                    "8": {"days_total": 31, "start_day": 3},
                    "9": {"days_total": 30, "start_day": 6},
                    "10": {"days_total": 31, "start_day": 1},
                    "11": {"days_total": 30, "start_day": 4},
                    "12": {"days_total": 31, "start_day": 6}
                },
                "2002": {
                    "1": {"days_total": 31, "start_day": 2},
                    "2": {"days_total": 28, "start_day": 5},
                    "3": {"days_total": 31, "start_day": 5},
                    "4": {"days_total": 30, "start_day": 1},
                    "5": {"days_total": 31, "start_day": 3},
                    "6": {"days_total": 30, "start_day": 6},
                    "7": {"days_total": 31, "start_day": 1},
                    "8": {"days_total": 31, "start_day": 4},
                    "9": {"days_total": 30, "start_day": 7},
                    "10": {"days_total": 31, "start_day": 2},
                    "11": {"days_total": 30, "start_day": 5},
                    "12": {"days_total": 31, "start_day": 7}
                },
                "2003": {
                    "1": {"days_total": 31, "start_day": 3},
                    "2": {"days_total": 28, "start_day": 6},
                    "3": {"days_total": 31, "start_day": 6},
                    "4": {"days_total": 30, "start_day": 2},
                    "5": {"days_total": 31, "start_day": 4},
                    "6": {"days_total": 30, "start_day": 7},
                    "7": {"days_total": 31, "start_day": 2},
                    "8": {"days_total": 31, "start_day": 5},
                    "9": {"days_total": 30, "start_day": 1},
                    "10": {"days_total": 31, "start_day": 3},
                    "11": {"days_total": 30, "start_day": 6},
                    "12": {"days_total": 31, "start_day": 1}
                },
                "2004": {
                    "1": {"days_total": 31, "start_day": 4},
                    "2": {"days_total": 29, "start_day": 7},
                    "3": {"days_total": 31, "start_day": 1},
                    "4": {"days_total": 30, "start_day": 4},
                    "5": {"days_total": 31, "start_day": 6},
                    "6": {"days_total": 30, "start_day": 2},
                    "7": {"days_total": 31, "start_day": 4},
                    "8": {"days_total": 31, "start_day": 7},
                    "9": {"days_total": 30, "start_day": 3},
                    "10": {"days_total": 31, "start_day": 5},
                    "11": {"days_total": 30, "start_day": 1},
                    "12": {"days_total": 31, "start_day": 3}
                }
            },
            "today":  {"date": 1433909084, "month": 6, "day": 10, "day_of_week": 3, "year": 2015},
            "format": "yyyy-MM-dd"
        };

        $scope.delayedDemoData = {};

        function copy(sourceObj) {
            return JSON.parse(JSON.stringify(sourceObj));
        }

        $timeout(function () {
            $scope.delayedDemoData = copy($scope.demoData);
        }, 2000);


        $scope.resultModel = '';
        $scope.resultDelayedModel = '';
        $scope.resultLinkedModel = '';
    })
;
