// Global State variables matching the algorithm lifecycle
let originalArray = [7, 4, 6, 9, 3];
let arr = [...originalArray];
let i = 1;
let j = 0;
let target = null;
let stepState = 'START_OUTF_LOOP'; // Lifecycle: START_OUTF_LOOP, INNER_WHILE, PLACE_TARGET, DONE

function render() {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';

    arr.forEach((val, idx) => {
        // Wrapper for card + index label
        const wrapper = document.createElement('div');
        wrapper.className = 'flex flex-col items-center gap-2 card-transition relative';

        // Index Label
        const label = document.createElement('span');
        label.className = 'text-xs font-bold text-slate-400';
        label.innerText = idx;
        wrapper.appendChild(label);

        // Card box
        const card = document.createElement('div');
        card.className = 'card-base border-2 rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm card-transition bg-white border-slate-300';
        card.innerText = val;

        // Apply contextual color coding based on step states
        if (stepState !== 'DONE') {
            // Is it the current actively lifted target card?
            if (idx === j + 1 && stepState === 'INNER_WHILE' && target !== null) {
                card.className = 'card-base border-2 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg card-transition bg-amber-100 border-amber-500 -translate-y-4';
            } 
            // Sorted Section boundary (everything left of i)
            else if (idx < i) {
                card.className = 'card-base border-2 rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm card-transition bg-emerald-50 border-emerald-400 text-emerald-800';
            }
        } else {
            // Sorting fully complete
            card.className = 'card-base border-2 rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm card-transition bg-emerald-100 border-emerald-500 text-emerald-900';
        }

        wrapper.appendChild(card);
        container.appendChild(wrapper);

        // Dynamic Visual Divider matching the paper sketch (placed right after the sorted section boundary)
        if (idx === i - 1 && stepState !== 'DONE') {
            const divider = document.createElement('div');
            divider.className = 'divider-line border-l-4 border-dashed border-slate-400 mx-2 self-end card-transition';
            container.appendChild(divider);
        }
    });

    // Update state variable counters on UI
    document.getElementById('varI').innerText = stepState === 'DONE' ? 'Finished' : i;
    document.getElementById('varJ').innerText = (stepState === 'DONE' || j < 0) ? '-' : j;
    document.getElementById('varTarget').innerText = target === null ? '-' : target;
}

function nextStep() {
    const log = document.getElementById('logPanel');

    if (i >= arr.length) {
        stepState = 'DONE';
        log.innerText = "Algorithm complete! The array is fully sorted.";
        document.getElementById('stepBtn').disabled = true;
        render();
        return;
    }

    if (stepState === 'START_OUTF_LOOP') {
        target = arr[i];
        j = i - 1;
        log.innerText = `Outer loop i=${i}: Setting target = ${target}. Preparing to inspect sorted section to the left.`;
        stepState = 'INNER_WHILE';
        render();
        return;
    }

    if (stepState === 'INNER_WHILE') {
        if (j >= 0 && arr[j] > target) {
            log.innerText = `Checking index j=${j} (${arr[j]}): Since ${arr[j]} > target (${target}), shift ${arr[j]} right to index ${j+1}.`;
            arr[j + 1] = arr[j]; // Duplicate/Shift value rightward
            j = j - 1;
            render();
        } else {
            if (j < 0) {
                log.innerText = `Inner loop ended: Reached start of array. Ready to drop target (${target}) at index ${j+1}.`;
            } else {
                log.innerText = `Inner loop ended: Element ${arr[j]} is not greater than target (${target}). Ready to drop target at index ${j+1}.`;
            }
            stepState = 'PLACE_TARGET';
        }
        return;
    }

    if (stepState === 'PLACE_TARGET') {
        arr[j + 1] = target;
        log.innerText = `Dropped target (${target}) into its correct position at index ${j+1}. Section up to index ${i} is now temporarily sorted.`;
        i++;
        stepState = i < arr.length ? 'START_OUTF_LOOP' : 'DONE';
        render();
        if(stepState === 'DONE') nextStep(); // Instantly update into final frame
    }
}

function resetVisualizer() {
    arr = [...originalArray];
    i = 1;
    j = 0;
    target = null;
    stepState = 'START_OUTF_LOOP';
    document.getElementById('logPanel').innerText = 'Visualizer reset. Click "Next Step" to begin.';
    document.getElementById('stepBtn').disabled = false;
    render();
}

function loadCustomArray() {
    const input = document.getElementById('arrayInput').value;
    const parsed = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    if (parsed.length > 0) {
        originalArray = parsed;
        resetVisualizer();
    } else {
        alert("Please enter a valid comma-separated list of integers.");
    }
}

function generateRandomArray() {
    const randomArr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10) + 1);
    document.getElementById('arrayInput').value = randomArr.join(', ');
    originalArray = randomArr;
    resetVisualizer();
}

// Initialize display on startup
render();