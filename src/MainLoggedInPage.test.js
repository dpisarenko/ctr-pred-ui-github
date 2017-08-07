import React from "react";
import { mount } from "enzyme";
import MainLoggedInPage from "./MainLoggedInPage";
var cookie = require('react-cookies')

describe("MainLoggedInPage", () => {
  let props;
  let mountedMainLoggedInPage;
  const mainLoggedInPage = () => {
    if (!mountedMainLoggedInPage) {
      mountedMainLoggedInPage = mount(
        <MainLoggedInPage {...props} />
      );
    }
    return mountedMainLoggedInPage
  }
  beforeEach(() => {
    props = {}
    mountedMainLoggedInPage = undefined
  })
  describe("when no user is logged in", () => {
    beforeEach(() => {
      cookie.remove('userId', { path: '/' })
      cookie.remove('admin', { path: '/' })
    });
    it("should render an empty div", () => {
      const page = mainLoggedInPage()
      expect(page.find("div").children().length).toBe(0)
      expect(page.find("div").html()).toBe("<div></div>")
    })
  })
  describe("when an admin user is logged in", () => {
    beforeEach(() => {
      cookie.save('userId', 'dp@altruix.cc', { path: '/' })
      cookie.save('admin', 'true', { path: '/' })
    });
    it("should render the page with unactivatedUserAccountsButton and" +
      " insertSampleDataButton", () => {
      const page = mainLoggedInPage()
      const buttons = page.find("button")
      expect(buttons.length).toBe(5)
      expect(page.find("button").at(0).text()).toBe("Unactivated User Accounts")
      expect(page.find("button").at(1).text()).toBe("Insert sample data")
      expect(page.find("button").at(2).text()).toBe("Submit campaign data")
      expect(page.find("button").at(3).text()).toBe("CTR estimates")
      expect(page.find("button").at(4).text()).toBe("Log out")
    })
  })
  describe("when an non-admin user is logged in", () => {
    beforeEach(() => {
      cookie.save('userId', 'dp@altruix.cc', { path: '/' })
      cookie.remove('admin', { path: '/' })
    });
    it("should render the page without unactivatedUserAccountsButton and" +
      " insertSampleDataButton", () => {
      const page = mainLoggedInPage()
      const buttons = page.find("button")
      expect(buttons.length).toBe(3)
      expect(page.find("button").at(0).text()).toBe("Submit campaign data")
      expect(page.find("button").at(1).text()).toBe("CTR estimates")
      expect(page.find("button").at(2).text()).toBe("Log out")
    })
  })
})