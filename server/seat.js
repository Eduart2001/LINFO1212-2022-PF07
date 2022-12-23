const sequelize = require("../Database/database");
const Seat = require("../Database/Seat");

/**
 * Returns an array of reserved seats for a given time table.
 * @param {string} timeTable - The ID of the time table.
 * @returns {Promise<number[]>} - A promise that resolves to an array of seat IDs.
 * @throws {Error} - If there is an error executing the database query.
 */
async function getReservedSeatsForTimeTable(timeTable){
    try{
        const [result,meta]=await sequelize.query(`Select id from Seats where timeTableId='${timeTable}'`);
        return result;

    }catch (e){
        return []
    }
}

/**
 * Returns an array of random integers ranging from 0 to max (exclusive) in a random order.
 * @param {number} max - The upper bound of the range of integers (exclusive).
 * @returns {number[]} - An array of random integers.
 */
function randomArray(max){
  var array = [];
  var randomArray = [];
  for (let i = 0;i<max;i++){
    array.push(i);
  }
  for (let j = 0;j<max;j++){
    var ranom = Math.floor(Math.random() * array.length);
    randomArray.push(array[ranom]);
    array.splice(ranom, 1);
  }
  return randomArray;
}

async function addSeats() {
  const [result, meta] = await sequelize.query("SELECT * FROM TimeTables");
  const [resultHall, metaHall] = await sequelize.query("SELECT * FROM Halls");
  var ids = [];
  for (obj of result) {
    ids.push(obj.hallId +"-"+obj.movieId+"-"+ obj.day+"-"+ obj.time);
  }
  for (obj of ids){
    var tempArray = randomArray(resultHall[parseInt(obj.split("-")[0])-1].capacity);
    for (var x = 0; x < 10; x++) {
        Seat.create({
          id: tempArray[x],
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
    if ((await sequelize.query("SELECT * FROM Seats"))[0].length == 0){
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
