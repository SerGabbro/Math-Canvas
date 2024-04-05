let pi = Math.PI;

function fourier() {
    let CanvasY = window.screen.height - 300;
    let CanvasX = window.screen.width - 100;

    var canvas = document.getElementById("chart");

    let armonic_number = document.getElementById("armonic_number").value;
    let amplitude = document.getElementById("amplitude").value;
    if (amplitude > 100) 
    {
        document.getElementById("amplitude").value = 100;
        amplitude = 100;
    }
    let periods = document.getElementById("periods").value;
    let type = document.getElementById("wavetype").value;

    var ctx = canvas.getContext("2d");
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.imageSmoothingEnabled = true;

    canvas.style.width = CanvasX + "px";
    canvas.style.height = CanvasY + "px";

    var scale = window.devicePixelRatio;
    canvas.width = CanvasX * scale;
    canvas.height = CanvasY * scale;

    ctx.scale(scale, scale);

    ctx.translate(0.5, 0.5);

    // DRAW X & Y AXIS
    ctx.moveTo(0, CanvasY / 2);
    ctx.lineTo(CanvasX, CanvasY / 2);
    ctx.moveTo(CanvasX / 2, 0);
    ctx.lineTo(CanvasX / 2, CanvasY);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1
    ctx.stroke();

    //Calculate max point and real multiplier
    let max_point = 0;
    let temp = 0;

    for (let i = 0; i <= CanvasX; ++i) {

        temp = compute_fourier_point(type, periods, armonic_number, i - 1, CanvasX);

        if (Math.abs(temp) > max_point) 
            max_point = Math.abs(temp);

    }

    let real_multiplier = (CanvasY / 2) / max_point; // Scale function to canvas
    real_multiplier *= amplitude / 100; // Scale function to a choosen value


    ctx.beginPath();

    for (let i = 0; i <= CanvasX; ++i) {

        ctx.moveTo(i - 1, CanvasY / 2 + real_multiplier * compute_fourier_point(type, periods, armonic_number, i - 1, CanvasX));

        ctx.lineTo(i, CanvasY / 2 + real_multiplier * compute_fourier_point(type, periods, armonic_number, i, CanvasX));

    }

    ctx.lineWidth = 2
    ctx.strokeStyle = '#edad21';
    ctx.stroke();

}

function compute_fourier_point(type, periods, armonic_number, index, max_index)
{
    let coefficient;
    let sine;

    let result;

    if (type == "triangle")
    {
        result = 0;

        for (let n = 0; n <= armonic_number; ++n)
        {

            coefficient = 8 / (pi * pi * (2 * n + 1) * (2 * n + 1));
            sine = Math.cos(2 * pi * (2 * n + 1) * periods * index / max_index);

            result += coefficient * sine;
        }

    }
    else if (type == "square")
    {
        result = 0;

        for (let n = 0; n <= armonic_number; ++n)
        {

            coefficient = 4 / (pi * (2 * n + 1));
            sine = Math.sin(2 * pi * (2 * n + 1) * periods * index / max_index);

            result += coefficient * sine;
        }

    }
    else if (type == "sawtooth")
    {
        result = 0;

        for (let n = 1; n <= armonic_number; ++n)
        {

            coefficient = negativeifeven(n) * -2 / (pi * n);
            sine = Math.sin(2 * pi * n * periods * index / max_index);

            result += coefficient * sine;
        }

    }
    else if (type == "weierstrass")
    {
        result = 0;

        for (let n = 0; n <= armonic_number; ++n)
        {

            coefficient = Math.pow(0.5, n);
            sine = Math.sin(2 * pi * Math.pow(10, n) * pi * periods * index / max_index);

            result += coefficient * sine;
        }

    }

    return result;
}


function notelementary()
{
    let CanvasY = window.screen.height - 300;
    let CanvasX = window.screen.width - 100;

    var canvas = document.getElementById("chart");

    let precision_summatory = document.getElementById("precision_notel").value;
    let amplitude = document.getElementById("amplitude_notel").value;
    let period_mul = document.getElementById("period_mul_notel").value;
    let type = document.getElementById("wavetype_notel").value;

    var ctx = canvas.getContext("2d");
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.imageSmoothingEnabled = true;

    canvas.style.width = CanvasX + "px";
    canvas.style.height = CanvasY + "px";

    var scale = window.devicePixelRatio;
    canvas.width = CanvasX * scale;
    canvas.height = CanvasY * scale;

    ctx.scale(scale, scale);

    ctx.translate(0.5, 0.5);


    // DRAW X AXIS
    ctx.moveTo(0, CanvasY / 2);
    ctx.lineTo(CanvasX, CanvasY / 2);
    //

    ctx.stroke();

    //Calculate max point and real multiplier
    let max_point = 0;
    let temp = 0;

    for (let i = 0; i <= CanvasX; ++i) {

        if (type == "erf")
            temp = compute_erf_point(i - CanvasX/2 - 1, precision_summatory, period_mul);
        else if (type == "si")
            temp = compute_Si_point(i - CanvasX/2 - 1, precision_summatory, period_mul);
        else
            console.log("Errore value!");


        if (Math.abs(temp) > max_point) max_point = Math.abs(temp);

    }

    let real_multiplier = amplitude * CanvasY / (max_point * 200);
    //
    let computed_point;

    ctx.beginPath();
    for (let i = 0; i <= CanvasX; ++i) {

        if (type == "erf")
        {
            ctx.moveTo(i - 1, CanvasY / 2 + real_multiplier * compute_erf_point(i - CanvasX/2 - 1, precision_summatory, period_mul));

            ctx.lineTo(i, CanvasY / 2 + real_multiplier * compute_erf_point(i - CanvasX/2, precision_summatory, period_mul));
        }
        else if (type == "si")
        {
            computed_point = real_multiplier * compute_Si_point(i - CanvasX/2 - 1, precision_summatory, period_mul);
            ctx.moveTo(i - 1, CanvasY / 2 + computed_point);

            computed_point = real_multiplier * compute_Si_point(i - CanvasX/2, precision_summatory, period_mul);
            ctx.lineTo(i, CanvasY / 2 + computed_point);
        }

    }

    ctx.stroke();
}


function compute_erf_point(index, precision, multiplier)
{
    result = 0.0;

    for (let i = 0; i < precision; ++i)
    {
        result += negativeifeven(i) * Math.pow(multiplier * index, 2 * i + 1) / (factorial(i) * (2 * i + 1));
    }

    result = result * 2 / 1.77;

    console.log("index: " + index * multiplier + " - value: " + result);
    
    return result;
}

function compute_Si_point(index, precision, multiplier)
{
    let result = 0;

    if (index == 1) return;

    result += Math.log(Math.abs(index * multiplier));

    if (result.isNaN) console.log("1: " + result);

    for (let i = 1; i < precision; ++i)
    {
        result += negativeifeven(i) * Math.pow(multiplier * index, 2 * i) / (factorial(i * 2)) / (2 * i);
    }

    if (result.isNaN) console.log("2: " + result);

    return result;
}

function negativeifeven(number)
{

    if (number % 2 == 0) return 1;
    else return -1;

}

function factorial(number)
{
    if (number < 0) return;

    if (number == 1 || number == 0)
        return 1;

    let result = number;

    for (let i = 2; i <= number; ++i)
    {
        result *= i;
    }

    return result;
}