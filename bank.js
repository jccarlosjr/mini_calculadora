function getData(){
    if (
        document.getElementById("original_term").value == '' || 
        document.getElementById("remaining_term").value == '' ||
        document.getElementById("installment").value == '' ||
        document.getElementById("balance").value == '' ||
        document.getElementById("bank").value == ''
    ){
        alert("Preencha todos os campos");
    }

    return {
        original_term: Number(document.getElementById("original_term").value||0),
        remaining_term: Number(document.getElementById("remaining_term").value||0),
        installment: Number(document.getElementById("installment").value||0),
        balance: Number(document.getElementById("balance").value||0),
        bank: Number(document.getElementById("bank").value||0),
    };
}


function portC6(data){
    const _12 = [149, 935];
    const _13 = [329];
    const _19 = [12];
    const _37 = [623];
    const fb = [707, 626, 336, 121, 380];
    const min_r = 0.0140;
    const min_i = 50.0;

    const paid_t = data.original_term - data.remaining_term;

    const rate = getRate(data.balance, data.installment, data.remaining_term);

    if(rate < min_r){
        return false
    } else if(data.installment < min_i){
        return false
    } else if(fb.includes(data.bank)){
        return false
    } else if(_12.includes(data.bank) && paid_t < 12){
        return false
    } else if(_13.includes(data.bank) && paid_t < 13){
        return false
    } else if(_19.includes(data.bank) && paid_t < 19){
        return false
    } else if(_37.includes(data.bank) && paid_t < 37){
        return false
    } else {
        return true
    }
}


function portFacta(data){
    const _12 = [318, 626, 336, 33];
    const _15 = [121, 254];
    const _16 = [623];
    const _24 = [707];
    const fb = [12, 611, 70, 925, 935, 149, 359, 917];
    const min_r = 0.01;
    const min_i = 50.0;

    const paid_terms = data.original_term - data.remaining_term;

    const rate = getRate(data.balance, data.installment, data.remaining_term);

    if(rate < min_r){
        return false
    } else if(data.installment < min_i){
        return false
    } else if(fb.includes(data.bank)){
        return false
    } else if(_12.includes(data.bank) && paid_terms < 12){
        return false
    } else if(_15.includes(data.bank) && paid_terms < 15){
        return false
    } else if(_16.includes(data.bank) && paid_terms < 16){
        return false
    } else if(_24.includes(data.bank) && paid_terms < 24){
        return false
    } else {
        return true
    }
}


function portFinanto(data){
    const _12 = [707, 121, 41, 623, 626, 326, 33, 254, 389];
    const _30 = [935, 149];
    const fb = [12, 329, 422, 752, 643, 925, 70];
    const min_r = 0.01;
    const min_b = 4000;

    const paid_terms = data.original_term - data.remaining_term;

    const rate = getRate(data.balance, data.installment, data.remaining_term);

    if(rate < min_r){
        return false
    } else if(data.balance < min_b){
        return false
    } else if(data.balance < 8000 && paid_terms <= 19){
        return false
    } else if(fb.includes(data.bank)){
        return false
    } else if(_12.includes(data.bank) && paid_terms < 12){
        return false
    } else if(_30.includes(data.bank) && paid_terms < 15){
        return false
    } else {
        return true
    }
}


function portQualibanking(data){
    const _12 = [707, 623, 33, 41, 254, 81, 290, 326];
    const fb = [12, 935, 149, 121, 329, 422, 752, 626, 336, 643, 25, 359, 47, 63, 82, 212, 243, 246, 320, 330, 349, 429, 654, 753];
    const min_r = 0.01;
    const min_b = 4000;

    const paid_terms = data.original_term - data.remaining_term;

    const rate = getRate(data.balance, data.installment, data.remaining_term);

    if(rate < min_r){
        return false
    } else if(data.balance < min_b){
        return false
    } else if(data.balance < 8000 && paid_terms <= 19){
        return false
    } else if(fb.includes(data.bank)){
        return false
    } else if(_12.includes(data.bank) && paid_terms < 12){
        return false
    } else {
        return true
    }
}


function imgHandler(o, i){
    if(o){
        i.classList.remove("disable-image");
        i.classList.add("enable-image");
    }
}


function getRate(amountFinanced, installment, terms) {
    /**
     * Calculate the loan rate based on the amount financed, installment, and terms.
     * Uses a binary search algorithm to find the rate.
     * Returns a default value of 0.01 (1%) if maxIterations is reached.
     *
     * @param {number} amountFinanced - The total amount financed.
     * @param {number} installment - The installment amount to be paid.
     * @param {number} terms - The number of terms for the loan.
     * @returns {number} The calculated loan rate or the default value.
     */
    const precision = 0.00001; // The precision level for the calculation
    let minRate = 0.001; // Minimum possible rate
    let maxRate = 0.04; // Maximum possible rate
    const maxIterations = 1000; // Maximum number of iterations for the binary search
    const defaultValue = 0.0; // Default rate to return if the desired precision is not achieved

    // Perform a binary search to find the rate
    for (let i = 0; i < maxIterations; i++) {
        let rate = (minRate + maxRate) / 2; // Calculate the midpoint rate
        let futureAmount = amountFinanced; // Initialize futureAmount with the initial amount financed

        // Simulate the loan repayment over the specified terms
        for (let j = 0; j < terms; j++) {
            futureAmount = futureAmount * (1 + rate) - installment;
        }

        // Check if the calculated future amount is within the desired precision
        if (Math.abs(futureAmount) < precision) {
            let rateDecimal = parseFloat(rate * 100)
            document.getElementById("rate-div").innerHTML = `<span id="rate-span">Taxa Calculada: ${rateDecimal.toFixed(2)}%</span>`
            return rate;
        }

        // Adjust the search range based on the future amount
        if (futureAmount > 0) {
            maxRate = rate; // Decrease the upper bound of the rate
        } else {
            minRate = rate; // Increase the lower bound of the rate
        }
    }

    let defaultValueDecimal = parseFloat(defaultValue * 100)

    document.getElementById("rate-div").innerHTML = `<span id="rate-span">Taxa Calculada: ${defaultValueDecimal.toFixed(2)}%</span>`

    return defaultValue; // Return the default rate if the desired precision is not achieved
}

document.getElementById("getPort").addEventListener("click", () => {
    const data = getData();
    let op_c6 = portC6(data);
    let op_facta = portFacta(data);
    let op_finanto = portFinanto(data);
    let op_qualibanking = portQualibanking(data);
    let c6Img = document.getElementById("c6-img");
    let factaImg = document.getElementById("facta-img");
    let finantoImg = document.getElementById("finanto-img");
    let qualibankingImg = document.getElementById("qualibanking-img");
    imgHandler(op_c6, c6Img);
    imgHandler(op_facta, factaImg);
    imgHandler(op_finanto, finantoImg);
    imgHandler(op_qualibanking, qualibankingImg);
})


document.getElementById("clearInputs").addEventListener("click", () => {
    [
        document.getElementById("c6-img"), 
        document.getElementById("facta-img"), 
        document.getElementById("finanto-img"), 
        document.getElementById("qualibanking-img")
    ].forEach(e => {
        e.classList.remove("enable-image");
        e.classList.add("disable-image");
    });

    [
        document.getElementById("original_term"),
        document.getElementById("remaining_term"),
        document.getElementById("installment"),
        document.getElementById("balance"),
        document.getElementById("bank")
    ].forEach(e => {
        e.value = ''
    });

    document.getElementById("rate-div").innerHTML = ``
})