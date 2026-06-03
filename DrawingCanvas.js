console.log("NEW VERSION LOADED");

console.log(window.supabase);

const supabaseUrl =
"https://ewikczkhfokqjordmjvz.supabase.co";

const supabaseKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aWtjemtoZm9rcWpvcmRtanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0OTY1ODgsImV4cCI6MjA5NjA3MjU4OH0.Z3TllaO0uQj0h3ZHRpx_Bm2dkZjaT6Bj3lwMRo4MKQ8";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);


console.log("DB:", db);
console.log("FROM:", db.from);

const picker = new iro.ColorPicker("#picker", {

    width:150,

    color:"#ff0000"

});

const colorBtn = document.querySelector(".colorbutton");
const pickerDiv = document.getElementById("picker");

colorBtn.addEventListener("click", () => {

    if(pickerDiv.style.display === "block"){

        pickerDiv.style.display = "none";

    }else{

        pickerDiv.style.display = "block";

    }

});

//VARIABLES

var submitBtn = document.querySelector(".submit");

var clearBtn = document.querySelector(".undo");

var canvas = document.querySelector("canvas");
canvas.width = 350;
canvas.height = 250;

var ctx = document.querySelector("canvas").getContext("2d");

var isDrawing = false;

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

//EVENT LISTENERS

canvas.addEventListener("mousedown", function(e){
    const pos = getPos(e);
    isDrawing = true;
    ctx.beginPath();
    ctx.strokeStyle = picker.color.hexString;
    ctx.lineWidth = document.querySelector("#brushSize").value;
    ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener("mousemove", function(e){

    if(!isDrawing) return;

    const pos = getPos(e);

    ctx.lineTo(pos.x, pos.y);

    ctx.strokeStyle = picker.color.hexString;
    ctx.lineWidth = document.querySelector("#brushSize").value;

    ctx.stroke();

});

canvas.addEventListener("mouseup", function(){

    isDrawing = false;

    ctx.beginPath();

});

clearBtn.addEventListener("click", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


canvas.addEventListener("mouseleave", function(){

    isDrawing = false;

    ctx.beginPath();

});

canvas.addEventListener("touchstart", function(e){
    e.preventDefault();
    const pos = getPos(e);
    isDrawing = true;
    ctx.beginPath();
    ctx.strokeStyle = picker.color.hexString;
    ctx.lineWidth = document.querySelector("#brushSize").value;
    ctx.moveTo(pos.x, pos.y);
}, { passive: false });

canvas.addEventListener("touchmove", function(e){
    e.preventDefault();
    if(!isDrawing) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = picker.color.hexString;
    ctx.lineWidth = document.querySelector("#brushSize").value;
    ctx.stroke();
}, { passive: false });

canvas.addEventListener("touchend", function(){
    isDrawing = false;
    ctx.beginPath();
}, { passive: false });

submitBtn.addEventListener("click", async function() {

    const dataURL =
        canvas.toDataURL("image/png");

const { data, error } =
await db
    .from("drawings")
    .insert([
        {
            image: dataURL
        }
    ]);

    console.log(db);
    console.log(data);
    console.log(error);

});