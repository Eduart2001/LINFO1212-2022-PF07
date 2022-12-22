const sequelize = require("../Database/database");
const Seat = require("../Database/Seat");
const timeTable = require("./timeTable");

async function getReservedSeatsForTimeTable(timeTable) {
  try {
    const [result, meta] = await sequelize.query(
      `Select id from Seats where timeTableId='${timeTable}'`
    );
    return result;
  } catch (e) {
    return [];
  }
}

async function addSeats() {
  const [result, meta] = await sequelize.query("SELECT * FROM TimeTables");
  var ids = [];
  for (obj of result) {
    ids.push(obj.hallId * 1000 + obj.movieId * 100 + obj.day * 10 + obj.time);
  }
  for (obj of ids){
    for (var x = 0; x < 19; x++) {
        Seat.create({
          id: x,
          timeTableId: obj,
        });
      }
  }
  return "example Seats added"
}

/**
 * Check if the Seats table is empty and, if it is, add test data to it.
 *
 * @returns {string} - A string indicating whether the Seats table is empty or not.
 */
async function emptyTimeTableDB(){
    if ((await addSeats()).length == 0){
        console.log("empty Seats table");
        addSeats();
        return "empty Seats table";
    } else{
        console.log("Seats table is not empty");
        return "Seats table is not empty";
    }
}
module.exports = {
  addSeats: addSeats,
  getReservedSeatsForTimeTable: getReservedSeatsForTimeTable,
  emptyTimeTableDB:emptyTimeTableDB,
};
