/**
 * Created by jaehoonlee88 on 15. 11. 23..
 */
/*
$("button").click(function(){
    console.log("H");
    $.post("/request_data/",
    {
        start_pos: "0",
        car_type: "0",
        start_time: "2015-11-01",
        end_time: "2015-11-02"
    },
    function(data, status){
        console.log(data);
        console.log(status);
        alert("Data: " + data + "\nStatus: " + status);
    });
});
    */
function compute(type){
    console.log("H");
    $.post("/request_data/",
    {
        start_pos: "0",
        car_type: type,
        start_time: "2015-10-26",
        end_time: "2015-11-02"
    },
    function(data, status){
        updateClicked(data);
        updateHeatmap(data);
    });

}