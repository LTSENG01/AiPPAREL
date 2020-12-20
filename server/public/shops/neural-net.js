window.onload = (init);

function init() {
    const two = new Two({
        type: Two.Types['svg'],
        fullscreen: true
    }).appendTo(document.body);

    let net = [];
    let lines = two.makeGroup();
    let netGroup = makeNet(two, net);
    lines.add(drawLines(net, two));
    lines.translation.set(two.width / 2 - 150, two.height / 2 - 200);
    netGroup.translation.set(two.width / 2 - 150, two.heightl / 2 - 200);
    two.update();

    two
        .bind('resize', function () {
            lines.translation.set(two.width / 2 - 150, two.height / 2 - 200);
            netGroup.translation.set(two.width / 2 - 150, two.height / 2 - 200);
        })
        .bind('update', function (frameCount) {
            lines.translation.set(two.width / 2 - 150, two.height / 2 - 200);
            netGroup.translation.set(two.width / 2 - 150, two.height / 2 - 200);
            if (frameCount % 50 === 0) {
                let flip = Math.random();
                if (flip > 0.5) {
                    let i = Math.floor(Math.random() * 4);
                    fire(net, 0, i);
                    let j = Math.floor(Math.random() * 3)
                    setTimeout(function () {
                        fire(net, 1, j);
                        synapse(net, 0, i, 1, j, two, lines);
                        let k = Math.floor(Math.random() * 2)
                        synapse(net, 1, j, 2, k, two, lines);
                        setTimeout(function () {
                                fire(net, 2, k);
                            }, 200
                        );
                    }, 200);
                }
            }
        })
        .play();

}

function makeNet(two, net) {
    let neurons = [4, 3, 2];
    let tempArr = [];
    let network = two.makeGroup();
    let temp;
    for (let j = 0; j < neurons[0]; ++j) {
        temp = (two.makeCircle(100, 100 + 50 * j, 10));
        temp.stroke = 'rgba(0, 0, 0, 0.66)';
        temp.linewidth = 7;
        temp.fill = 'rgb(0, 200, 255)';
        tempArr.push(temp);
    }
    net.push(tempArr);
    network.add(tempArr);
    tempArr = [];
    for (let j = 0; j < neurons[1]; ++j) {
        temp = (two.makeCircle(100 + 80, 100 + 50 * j + 25, 10));
        temp.stroke = 'rgba(0, 0, 0, 0.66)';
        temp.linewidth = 7;
        temp.fill = 'rgb(0, 200, 255)';
        tempArr.push(temp);
    }
    net.push(tempArr);
    network.add(tempArr);
    tempArr = [];
    for (let j = 0; j < neurons[2]; ++j) {
        temp = (two.makeCircle(100 + 160, 100 + 50 * j + 50, 10));
        temp.stroke = 'rgba(0, 0, 0, 0.66)';
        temp.linewidth = 7;
        temp.fill = 'rgb(0, 200, 255)';
        tempArr.push(temp);
    }
    network.add(tempArr);
    net.push(tempArr);
    return network;

}

function drawLines(network, two) {
    let lines = two.makeGroup();
    for (let i = 0; i < network.length - 1; ++i) {
        for (let j = 0; j < network[i].length; ++j) {
            for (let k = 0; k < network[i + 1].length; ++k) {
                const line = two.makeLine(network[i][j].translation.x, network[i][j].translation.y, network[i + 1][k].translation.x, network[i + 1][k].translation.y);
                line.linewidth = 4;
                line.stroke = "rgba(0, 0, 0, 1)";
                lines.add(line);
            }
        }
    }
    return lines;
}

function fire(net, i1, i2) {
    net[i1][i2].stroke = 'rgba(0, 0, 0, 0.66)';
    net[i1][i2].linewidth = 7;
    net[i1][i2].fill = 'rgb(255, 0, 0)';
    setTimeout(function () {
        net[i1][i2].stroke = 'rgba(0, 0, 0, 0.66)';
        net[i1][i2].linewidth = 7;
        net[i1][i2].fill = 'rgb(0, 200, 255)';
    }, 1000);
}

function synapse(network, i1, i2, j1, j2, two, lines) {
    const line = two.makeLine(network[i1][i2].translation.x, network[i1][i2].translation.y, network[j1][j2].translation.x, network[j1][j2].translation.y);
    line.linewidth = 5;
    line.stroke = "rgba(255, 0, 0, 0.3)";
    lines.add(line);
}
