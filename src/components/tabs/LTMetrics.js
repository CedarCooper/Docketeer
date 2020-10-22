/* eslint-disable react/prop-types */
import React, {useState, useEffect} from "react";
import { convertToMetricsArr } from "../helper/parseContainerFormat";
import { Pie, Line } from "react-chartjs-2";


/**
 * 
 * @param {*} props 
 * Display general metrics
 */
const Metrics = (props) => {
	const [activeContainers, setActiveContainers] = useState({});


	
	let memory = {
		labels: [1],
		datasets: []
	};

	const cpu = {
		labels: [],
		datasets: []
	};

	const formatData = () => {

		console.log('active containers: ', activeContainers)
		//if active containers is empty render the empty graphs
		if (!Object.keys(activeContainers).length) {
			console.log('inside conditional')
			return;
		}
		// DB QUERY LIKELY GOING HERE
		const data = [	{name: 'dazzling_jennings', time: "1", block: "0B/0B", cid: "db06b75e6db7", cpu: "4.00%", mp: "0.18%", mul: "2.523MiB/1.945GiB", net: "50B/0B", pids: "3"}]
		// reset datasets to empty array
		memory.datasets = [];
		cpu.datasets = [];
		
		console.log('ContainerName: ', data)


		// build two fundtion that will return formated object for each container to in datapoins
		const cpuBuilder = (containerName) => {
      const obj = {
        label: containerName,
        data: [],
        fill: false,
      };
      return obj;
		};
		
    const memoryBuilder = (containerName) => {
      const obj = {
        label: containerName,
        data: [],
        fill: false,
      };
      return obj;
		};

		const auxObj = {}

		// build the auxilary object to hold active container data
		 
		Object.keys(activeContainers).forEach(container => {
			auxObj[container] = {
				memory: memoryBuilder(container), 
				cpu: cpuBuilder(container)
			}
		});

		console.log('this is your auxObject before data.forEach: ', auxObj)
		
		// iterate through each row from query and buld Memory and CPU objects
		data.forEach((dataPoint) => {
			const currentContainer = dataPoint.name;

			// console.log('data point: ',dataPoint);

			// console.log('data point Cpu: ', dataPoint.cpu);
			auxObj[currentContainer].cpu.data.push(dataPoint.cpu.replace('%', ''))
			auxObj[currentContainer].memory.data.push(dataPoint.mp.replace('%', ''))
			console.log('Auxobj: ', auxObj);
		});


		
		Object.keys(auxObj).forEach(containerName => {
			memory.datasets.push(auxObj[containerName].memory);
			cpu.datasets.push(auxObj[containerName].cpu);
		});	

		console.log('memory after : ', memory)
		console.log('cpu after : ', cpu);
	}

	

	// Internal Note: maybe want to fix currentList and make a state variable??
	let currentList;
	const selectList = () => {
		const result = [];
		props.runningList.forEach(container => {
			// result.push(<option value={container.name}>{container.name}</option>)
			result.push(<div><label htmlFor={container.name}>{container.name}</label><input name={container.name} type="checkbox" value={container.name}></input></div>)
		})
		// <input name="container-1" type="checkbox" value="Container-1"></input>
		// <label htmlFor="container-1">Container 1</label>
		props.stoppedList.forEach(container => {
			result.push(<div><label htmlFor={container.name}>{container.name}</label><input name={container.name + "(- Stopped)"} type="checkbox" value={container.name}></input></div>)
		})
		currentList = result; 
	}


	const handleChange = (e) => {
		const containerName = e.target.name;
		// deep copy the state object - shallow copy didn't work
		const copyObj = JSON.parse(JSON.stringify(activeContainers));
		if (activeContainers[containerName])  {
			delete copyObj[containerName];
		} else {
			copyObj[containerName] = true;
		} 
		setActiveContainers(copyObj);
	}

	let cpuOptions = {
		tooltips: {
			enabled: true,
			mode: 'index',
		},
		title: {
			display: true,
			text: "CPU",
			fontSize: 23,
		},
		legend: { display: true, position: "bottom" },
		responsive: true,
		maintainAspectRatio: true,

	};

	let memoryOptions = {
		tooltips: {
			enabled: true,
			mode: 'index',
		},
		title: {
			display: true,
			text: "MEMORY",
			fontSize: 23,
		},
		legend: { display: true, position: "bottom" },
		responsive: true,
		maintainAspectRatio: true,
	};
	
	selectList();
	useEffect(() => {
		console.log('in use effect with memory: ', memory)
		formatData();
	}, [activeContainers])

	return (
		<div className="renderContainers">
			<div className="header">
				<span className="tabTitle">Metrics</span>
			</div>
			<div style={{marginTop: "150px"}}> 
				<form onChange={(e) => {handleChange(e)}}>
					{currentList}
				</form>
			</div>

			<div className="allCharts">
				
				<div className="line-section">
					<div className="lineChart">
						<Line data={memory} options={memoryOptions} width={4000} height={2600} />
					</div>
				</div>

				<div className="line-section">
					<div className="lineChart">
						<Line data={cpu} options={cpuOptions} width={4000} height={2600} />
					</div>
				</div>

			</div>
		</div>
	);
};

export default Metrics;

// block: "0B/0B", 
// cid: "db06b75e6db7", 
// cpu: "4.00%", CPU PERCENTAGE
// mp: "0.18%", MEMORY PERCENTAGE
// mul: "2.523MiB/1.945GiB", 
// name: "compassionate_goldberg", 
// net: "50B/0B", TRANSMITTED / RECEIVED  
// pids: "3" MAYBE

// write a handleChange function 
// build state with selected containers --> ['container-1', 'container-2']
// query db for information based on current selections (for now this will be dummy data)
// create a object to be pushed into the dataset prop for the respective graph
// push the object into the graph
	// component should rerender when update


	// const cpu = {
	// 	labels: dataLabels,
	// 	datasets: [
	// 		{
	// 			label: activeContainers,
	// 			 data: cpuData, 
	// 			 fill: false
	// 		},
	// 	],
	// };