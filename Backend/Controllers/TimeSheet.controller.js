import TimeTrackingModal from "../Models/TimeCounter.model.js";
import moment from "moment";

export const getTimesheet = async (req, res) => {
  try {
    const { name, email, date, startWeek, endWeek, month, year } = req.body;

    let query = {};

    // ✅ If a specific date is provided
    if (date) {
      const formattedDate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
      query.date = formattedDate; // Compare in proper format
    }

    // ✅ If a date range (week) is provided
    if (startWeek && endWeek) {
      const start = moment(startWeek, "DD-MM-YYYY").format("YYYY-MM-DD");
      const end = moment(endWeek, "DD-MM-YYYY").format("YYYY-MM-DD");

      query.date = { $gte: start, $lte: end };
    }

    if (month && year) {
      const monthNames = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };
    
      const monthNumber = monthNames[month];
    
      if (!monthNumber) {
        return res.status(400).json({
          status: "failure",
          message: "Invalid month format. Use 'Jan', 'Feb', etc.",
        });
      }
    
      // Convert the month & year into a valid date range
      const start = moment(`01-${monthNumber}-${year}`, "DD-MM-YYYY").startOf("month");
      const end = moment(start).endOf("month");
    
      // Convert your stored "date" string into a Date object before comparing
      query.$expr = {
        $and: [
          {
            $gte: [
              { $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } },
              start.toDate(),
            ],
          },
          {
            $lte: [
              { $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } },
              end.toDate(),
            ],
          },
        ],
      };
    }
    
    // ✅ If name or email is provided, add them to the query
    if (name || email) {
      query.$or = [];
      if (name) query.$or.push({ name });
      if (email) query.$or.push({ email });
    }

    console.log("MongoDB Query:", JSON.stringify(query, null, 2)); // ✅ Log for debugging

    // ✅ Fetch data based on the built query
    const data = await TimeTrackingModal.find(query);

    // ✅ If no data is found, return an appropriate response
    if (data.length === 0) {
      return res.status(404).json({
        status: "failure",
        message: "No records found for the given filters",
        filtersUsed: { name, email, date, startWeek, endWeek, month, year },
      });
    }

    // ✅ Return success response if data exists
    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};
