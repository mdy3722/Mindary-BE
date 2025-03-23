import React, { useState, useEffect } from "react";
import CalendarComponent from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import moment from "moment";

const ReactCalendar = ({ onDateChange }) => {
  const [view, setView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [formattedDate, setFormattedDate] = useState(
    moment(selectedDate).format("MMMM YYYY")
  );

  useEffect(() => {
    setFormattedDate(moment(selectedDate).format("MMMM YYYY"));
    setActiveStartDate(selectedDate);
  }, [selectedDate]);

  const handleDateClick = (date) => {
    const newDate = new Date(date);
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const handleSidebarToggle = () => {
    setSidebarVisible((prevVisible) => !prevVisible);
  };

  const handleSidebarMonthClick = (monthIndex) => {
    const newDate = new Date(selectedDate.getFullYear(), monthIndex);
    setSelectedDate(newDate);
    setView("month");
    setSidebarVisible(false);
  };

  const handleSidebarYearClick = (year) => {
    const newDate = new Date(year, selectedDate.getMonth());
    setSelectedDate(newDate);
    setView("month");
    setSidebarVisible(true);
  };

  const changeYear = (delta) => {
    const newYear = selectedDate.getFullYear() + delta;
    handleSidebarYearClick(newYear);
  };

  const renderSidebar = () => {
    if (!sidebarVisible) return null;

    const months = moment.months();
    const currentYear = selectedDate.getFullYear();

    return (
      <Sidebar>
        <YearSelector>
          <button onClick={() => changeYear(-1)}>{"<"}</button>
          <span>{currentYear}</span>
          <button onClick={() => changeYear(1)}>{">"}</button>
        </YearSelector>
        <MonthSelector className="items">
          {months.map((month, index) => (
            <div
              key={index}
              className="item"
              onClick={() => handleSidebarMonthClick(index)}
            >
              {month}
            </div>
          ))}
        </MonthSelector>
      </Sidebar>
    );
  };

  return (
    <Container>
      <StyledCalendarWrapper>
        <StyledCalendar
          formatMonthYear={(locale, date) => (
            <DateText onClick={handleSidebarToggle}>
              <span className="month-underline">
                {moment(date).format("MMMM")}
              </span>
              ,&nbsp;
              <span className="year-underline">
                {moment(date).format("YYYY")}
              </span>
            </DateText>
          )}
          formatDay={(locale, date) => moment(date).format("D")}
          showNeighboringMonth={false}
          next2Label={null}
          prev2Label={null}
          minDetail="month"
          tileClassName={({ date }) => {
            if (moment(date).isSame(new Date(), "day")) {
              return "react-calendar__tile--now";
            }
            if (moment(date).isSame(selectedDate, "day")) {
              return "react-calendar__tile--active";
            }
            return null;
          }}
          value={selectedDate}
          view={view}
          onClickDay={handleDateClick}
          onActiveStartDateChange={({ activeStartDate }) =>
            setActiveStartDate(activeStartDate)
          }
          activeStartDate={activeStartDate}
          prevLabel={<span className="hidden">&lt;</span>}
          nextLabel={<span className="hidden">&gt;</span>}
        />
        <SidebarToggleButton onClick={handleSidebarToggle}>
          {formattedDate}
        </SidebarToggleButton>
      </StyledCalendarWrapper>
      {renderSidebar()}
    </Container>
  );
};

export default ReactCalendar;
const Container = styled.div`
  display: flex;
  position: relative;
`;

const StyledCalendarWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  flex-direction: column;

  .hidden {
    display: none;
  }

  .month-underline {
    text-decoration: underline;
  }

  .year-underline {
    text-decoration: underline;
  }

  .react-calendar {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-width: 348px;
    max-height: 151px;
    border: none;
    line-height: normal;
    background-color: transparent;
  }

  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 29px;
  }

  .react-calendar__navigation button {
    font-weight: 800;
    font-size: 18px;
  }

  .react-calendar__navigation button:focus {
    background-color: transparent;
  }

  .react-calendar__navigation button:disabled {
    background-color: transparent;
    color: black;
  }

  .react-calendar__viewContainer {
    display: flex;
  }

  .react-calendar__navigation__label {
    flex-grow: 0 !important;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
  }

  .react-calendar__month-view__weekdays__weekday {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f4f4f4;
    height: 29px;
    border-bottom: 1px solid black;
    border-top: 1px solid black;
    border-left: 1px solid black;
  }

  .react-calendar__tile.react-calendar__month-view__days__day {
    flex: 0 0 14.5%;
    overflow: hidden;
    margin-inline-end: 0px;
  }

  .react-calendar__month-view__weekdays__weekday:last-child {
    border-right: 1px solid black;
  }

  .react-calendar__month-view__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
  }

  .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-size: 14px;
    height: 29px;
  }

  .react-calendar__tile:nth-last-of-type(-n + 7) {
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    color: black;
    font-weight: 900;
  }

  .react-calendar__tile--now {
    font-weight: 900;
    background-color: ${({ theme }) => theme.background};
  }

  .react-calendar__year-view__months__month {
    background-color: transparent;
    padding: 0;
  }

  .react-calendar__month-view__days {
    height: 151px;
    width: 344px;
    background-color: white;
  }

  .react-calendar__tile--hasActive {
    background-color: transparent;
  }

  .react-calendar__navigation__arrow {
    order: 2;
  }

  .react-calendar__month-view {
    abbr {
      color: black;
    }
  }

  .react-calendar__navigation__label {
    order: 1;
  }

  .react-calendar__tile {
    position: relative;
    font-size: 14px;
  }

  .react-calendar__year-view__months {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .react-calendar__year-view__months__month {
    flex: 0 0 calc(33.3333% - 10px) !important;
    border: none;
    height: 29px;
    width: 119px;
    font-size: 0.9rem;
    font-weight: 600;
    color: black;
  }

  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
  }

  .react-calendar__tile--now {
    background-color: ${({ theme }) => theme.background} !important;
  }

  .react-calendar__tile--active,
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background-color: transparent !important;
    color: black !important;
  }

  .react-calendar__tile--active.react-calendar__tile--now,
  .react-calendar__tile--active:enabled:hover.react-calendar__tile--now,
  .react-calendar__tile--active:enabled:focus.react-calendar__tile--now {
    background-color: ${({ theme }) => theme.background} !important;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 82px;
  left: 168px;
  height: 388px;
  width: 118px;
  background: transparent;
  border: 1px solid black;
  z-index: 1000;
  font-family: "PreVariable";
`;

const YearSelector = styled.div`
  display: flex;
  height: 31px;
  justify-content: center;
  align-items: center;

  button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }

  span {
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
`;

const MonthSelector = styled.div`
  display: flex;
  flex-direction: column;

  .item {
    height: 30px;
    width: 117px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      background-color: ${({ theme }) => theme.background};
      font-weight: 700;
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;

const SidebarToggleButton = styled.button`
  position: fixed;
  top: 174px;
  background: transparent;
  color: black;
  border: none;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  z-index: 1000;
`;

export const StyledCalendar = styled(CalendarComponent)`
  width: 100%;
  max-width: 350px; /* Ensure calendar width fits the container */
  font-family: "PreVariable";
  .react-calendar__month-view__days {
    min-height: 180px; /* Ensure enough height for 6 weeks */
    overflow: hidden;
  }
  .react-calendar__tile {
    font-size: 14px;
    height: 30px; /* Adjust tile height to prevent overflow */
  }
`;

export const DateText = styled.div`
  display: none;
  flex-direction: row;
  cursor: pointer;
`;
