import React from "react";
import { mount } from "enzyme";
import CtrEstimatesPage from "./CtrEstimatesPage";
var cookie = require('react-cookies')
var CtrEstimate = require('../model/ctrEstimate')
var DataProcessingError = require('../model/dataProcessingError')

describe("CtrEstimatesPage", () => {
  let props;
  let mountedUiComponent;
  const uiComponent = () => {
    if (!mountedUiComponent) {
      mountedUiComponent = mount(
        <CtrEstimatesPage {...props} />
      )
    }
    return mountedUiComponent
  }
  beforeEach(() => {
    props = {}
    mountedUiComponent = undefined
  })
  
  describe("when user is not logged in", () => {
    beforeEach(() => {
      cookie.remove('userId', { path: '/' })
      cookie.remove('admin', { path: '/' })
    });
    it("renders an empty div", () => {
      const divs = uiComponent().find("div");
      expect(divs.length).toBe(1);
      const divChildren = uiComponent().find("div").at(0).children()
      expect(divs.length).toBe(1);
    })
  })
  describe("when user is logged in and data loaded", () => {
    beforeEach(() => {
      props.state = { ctrEstimates: [], errors: [] }
      cookie.save('userId', 'dp@altruix.cc', { path: '/' })
    });
    it("renders a non-empty div", () => {
      const divs = uiComponent().find("div");
      expect(divs.length).toBe(2);
      const divChildren = uiComponent().find("div").at(0).children()
      expect(divs.length).toBe(2);
    })
  })
  describe("when user is logged in and ctr estimates available", () => {
    beforeEach(() => {
      uiComponent().setState({ ctrEstimates: [new CtrEstimate({
        email:'dp@altruix.cc',
        keywords:'buy car berlin',
        ctrEstimate:0.5
      })], errors: [] })
      cookie.save('userId', 'dp@altruix.cc', { path: '/' })
    });
    it("displays CTR estimates in a table", () => {
      const table = uiComponent().find("Table")
      const tbody = table.children().at(1)
      const row = tbody.children().at(0)
      const keywordCell = row.children().at(0)
      const ctrEstimateCell = row.children().at(1)
      expect(keywordCell.text()).toBe("buy car berlin")
      expect(ctrEstimateCell.text()).toBe("0.5")
    })
  })
  describe("when user is logged in and data processing errors present", () => {
    beforeEach(() => {
      uiComponent().setState({ ctrEstimates: [], errors: [new DataProcessingError({
          email: 'dp@altruix.cc',
          message: "Error: The submitted file 'sampleFile.dat' is not an Excel document."
        })]})
      cookie.save('userId', 'dp@altruix.cc', { path: '/' })
    })
    it("displays data processing errors in a table", () => {
      const ol = uiComponent().find("ol")
      const rows = ol.children()
      expect(rows.length).toBe(1)
      expect(rows.at(0).text()).toBe("Error: The submitted file 'sampleFile.dat' is not an Excel document.")
    })
  })
})