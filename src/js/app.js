import p5 from "p5";


const _func = [
    { 
        'func' : 'random() * r',
        'label' : 'random()'
    },{ 
        'func' : 'random(random()) * r',
        'label' : 'random(random())'
    },{ 
        'func' : 'random(random(random())) * r',
        'label' : 'random(random(random()))'
    },{ 
        'func' : 'random(random(random(random()))) * r',
        'label' : 'random(random(random(random())))'
    },{ 
        'func' : 'sqrt(random()) * r',
        'label' : 'sqrt(random())'
    },{ 
        'func' : 'Math.pow(1 - Math.pow(random(),10), 10) * r',
        'label' : 'pow(1 - pow(random(),10), 10)'
    },{ 
        'func' : 'tan(random(TWO_PI)) * r',
        'label' : 'tan(random(TWO_PI))'
    },{ 
        'func' : 'atan(random(TWO_PI)) * r / sqrt(2)',
        'label' : 'atan(random(TWO_PI)) / sqrt(2)'
    },{ 
        'func' : '(1 - random()) * r',
        'label' : '1 - random()'
    },{ 
        'func' : '(1 - random(random())) * r',
        'label' : '1 - random(random())'
    },{ 
        'func' : '(1 - random(random(random()))) * r',
        'label' : '1 - random(random(random()))'
    },{ 
        'func' : '(1 - random(random(random(random())))) * r',
        'label' : '1 - random(random(random(random())))'
    },{ 
        'func' : '(1 - sqrt(random())) * r',
        'label' : '1 - sqrt(random())'
    }
];

const fn = {
    rdm : function(from, to) { 
        return Math.floor((Math.random()*((to+1)-from)) + from);
    },
    lerp : function(start, end, t) {
        let t1 = t - 1;
        t = 1 + t1 * t1 * t1 * t1 * t1;
        return start * (1 - t) + end * t;
    },
    pointAt : function(a, b, at) {
        return {
            x : Math.round(this.lerp(a.x, b.x, at)),
            y : Math.round(this.lerp(a.y, b.y, at))
        }
    },
    pointsDistance : function( x1, y1, x2, y2 ) {
        let xs = x2 - x1;
        let ys = y2 - y1;
        return Math.sqrt( (xs*xs) + (ys*ys) );
    }
};

const app = (function() {

    let config = {
        width   : 460,
        height  : 460,
        fps     : 60,
        density : 3.0,

        dots : [],
        targets : [],
        radius : 175,
        option : 0,
        elements : 2500,
        counter : 0,
        animation : 60,
        fills : [],
        interval : null
    }

    for ( let i=0; i<config.elements; i++ ) {
        config.fills.push([fn.rdm(0, 64), fn.rdm(32, 196), fn.rdm(128, 255), 128])
    }
    config.cx = (config.width / 2);
    config.cy = (config.height / 2);
    config.out_radius = fn.pointsDistance(0, 0, config.cx, config.cy) - config.radius;

    return config;

})();

function render_ui() {

    let _title = document.createElement('h3');
        _title.innerHTML = 'random() distribution visualizer';

    let _selector = document.createElement('div');
        _selector.id = 'selector';

        for ( let  i=0; i<_func.length; i++ ) {
            let _option = document.createElement('button');
                _option.value = i;
                _option.innerHTML = _func[i].label;
                _option.addEventListener('click', function() {
                    window.clearInterval(app.interval);
                    switch_func(this.value);
                });
                if ( app.option == i ) {
                    _option.classList.add('active');
                }
            _selector.appendChild(_option);
        }

    let _canvas = document.querySelectorAll('canvas')[0];
    let _root = _canvas.parentNode;
        _root.insertBefore(_selector, _canvas.nextSibling);
        _root.insertBefore(_title, _canvas);  
}

function switch_func(i) {
    app.option = i;

    let _buttons = Array.from(document.querySelectorAll('#selector button'));
        _buttons.forEach(function(el, e) {
            if ( el.value == i ) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

    app.counter = 0;
    app.targets = create_targets();
    loop();
}

function create_dot() {

    let _angle = random(360);
    let r = app.radius ;
    let _r = eval(_func[app.option].func);
    let x = app.cx + floor( cos( radians(_angle) ) * _r );
    let y = app.cy + floor( sin( radians(_angle) ) * _r );
    return { x, y };
}

function create_dots() {

    let _dots = [];
    for ( let i = 0; i < app.elements; i++ ) {
        let _dot = create_dot();
        _dots.push( _dot );
    }
    return _dots;
}

function create_targets() {

    let _targets = [];
    for ( let i=0; i<app.elements; i++ ) {
        let _trg = create_dot();
        _targets.push( _trg );
    }

    // ~~~~~~~~~~~~
    let closest = ({ x, y }, data) => data.reduce((a, b) => Math.hypot(x - a.x, y - a.y) < Math.hypot(x - b.x, y - b.y) ? a : b);
    let _from = [...app.dots];
    let _to = [..._targets];
    let _output = [];

    for ( let j=0; j<_from.length; j++ ) {

        let _closest = closest(_from[j], _to);
        let _index = _to.indexOf(_closest);
            _to.splice(_index, 1);

        _output.push(_closest);
    }

    return _output; // return _targets;
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


window.setup = function() {
    
        let cnv = createCanvas( app.width, app.height );
            // cnv.parent("body");

        pixelDensity( app.density );
        frameRate( app.fps );
        noLoop();

        cnv.style('max-height', `${app.height}px`);
        cnv.style('max-width', `${app.width}px`);

        // ~~~~~~~~~~
    
        render_ui();
        app.dots = create_dots();
        app.targets = [...app.dots];

};

window.draw = function() {

        let _position = parseFloat(app.counter/app.animation);
        for ( let i = 0; i < app.dots.length; i++ ) {
            app.dots[i] = fn.pointAt( app.dots[i], app.targets[i], _position );
        }
    
        // Halo
        background( 17 );
        fill( 0, 0, 255, 32 );
        noStroke();
        for ( let i=0; i<app.dots.length; i++ ) { 
            fill( ...app.fills[i] );
            circle( app.dots[i].x, app.dots[i].y, 2 );
        }
    
        // Nucleus
        strokeWeight(1);
        stroke( 255, 64 );
        for ( let i=0; i<app.dots.length; i++ ) {
            point( app.dots[i].x, app.dots[i].y )
        }
    
        // Outter Circle
        noFill()
        strokeWeight( app.out_radius );
        stroke( 17, 128 );
        circle( app.cx, app.cy, app.radius*2 + app.out_radius );
    
        // Outter Frame
        strokeWeight( (app.width - (app.radius*2))/2 );
        stroke( 17, 128 );
        rect( 0, 0, app.width, app.height );
    
        app.counter++;
        if (app.counter > app.animation) { noLoop(); }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

window.addEventListener("load", function(event) {
 
    switch_func(0);
    let _counting = 1;

    app.interval = window.setInterval(function() {

        switch_func(_counting);
        _counting++;
        if (_counting >= _func.length) { _counting = 0 }

    }, 1500);

});