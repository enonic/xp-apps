
# XP js-ui-testing


## Building

Before trying to run tests, you need to verify that the following software are installed:

* Java 8 (update 92 or above) for building and running.
* node.js installed on system
* gulp installed(npm)
* Git installed on system.
* Chrome browser installed on system.

Run all tests including integration tests:
 1. gradle downloadAndUsersTest
 2. gradle localUsersTest

 Reporting:
 allure generate allure-results --clean -o allure-report && allure open allure-report

