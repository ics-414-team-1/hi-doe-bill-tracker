import React, { useState, useEffect } from 'react';
import {
  Col,
  Container,
  Row,
  Tabs,
  Tab,
} from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import BillTable from '../components/BillTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import Filter from '../components/Filter';
import Autocomplete from '../components/Autocomplete';
import { Measures } from '../../api/measure/MeasureCollection';
import { Hearings } from '../../api/hearing/HearingCollection';

const ListBill = () => {
  const { ready, measures, hearings } = useTracker(() => {
    const subscription = Measures.subscribeMeasures();
    const subscription2 = Hearings.subscribeHearings();
    const rdy = subscription.ready();
    const rdy2 = subscription2.ready();
    const measuresItems = Measures.find({}).fetch();
    const hearingItems = Hearings.find({}).fetch();
    console.log(measuresItems);
    console.log(hearingItems);
    return {
      measures: measuresItems,
      hearings: hearingItems,
      ready: rdy, rdy2,
    };
  }, []);
  const [currentTab, setCurrentTab] = useState('Upcoming Bills');
  // TODO: Object with { header: '', component: ''}
  const table_headers = ['Save Bill', 'Bill Number', 'Bill Name', 'Bill Status', 'Hearing Date', 'View Bill'];
  const BillData = measures.map((measureData) => ({
    _id: measureData._id,
    billTitle: measureData.measureTitle,
    billStatus: measureData.status,
    billHearing: measureData.year,
    billNumber: measureData.measureNumber,
    bill_updated: 1663711472,
    bill_committee: 'Agriculture & Environment',
    measureType: 'HB',
    office: 'office1',
  }));
  const HearingData = hearings.map((hearingData) => ({
    hearingLocation: hearingData.room,
    dateIntroduced: hearingData.year,
    committeeHearing: hearingData.committee,
    roomNumber: hearingData.room,
    doeStance: hearingData.description,
    dateTime: hearingData.datetime,
  }));
  const [data, setData] = useState([]);
  // TODO: Remove this once we have our API set up and split the Bill data into (upcoming bills, dead bills, bills)
  useEffect(() => {
    setData(BillData);
  }, [ready]);
  const [data2, setHearingData] = useState([]);
  useEffect(() => {
    setHearingData(HearingData);
  }, [ready]);
  const handleCurrentTab = (tabName) => {
    setCurrentTab(tabName);
  };
  const tabs = ['Upcoming Bills', 'Bills', 'Dead Bills'];
  return (ready ? (
    <Container id={PAGE_IDS.LIST_BILLS} className="py-3">
      <Row>
        <Col md={3}>
          <Filter tab={currentTab} data={data} handleDataFiltering={setData} />
        </Col>
        <Col md={7} className="mx-3">
          <Autocomplete billData={data} onDataFiltering={setData} />
          <Tabs
            defaultActiveKey="Upcoming Bills"
            id="uncontrolled-tab-example"
            className="mb-3"
            onSelect={(e) => (handleCurrentTab(e))}
          >
            {tabs.map((tab, index) => (
              <Tab eventKey={tab} title={tab} key={index}>
                <Col className="text-center">
                  <h2>{tab}</h2>
                </Col>
                <BillTable billData={data} hearingData={data2} tableHeaders={table_headers} />
              </Tab>
            ))}
          </Tabs>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Measures" />);
};

export default ListBill;
