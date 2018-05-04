module.exports=(timestamp1,timestamp2)=>{
	let d1=new Date(timestamp1);
	let d2=new Date(timestamp2);
	return d1.getFullYear() === d2.getFullYear() &&
		    d1.getMonth() === d2.getMonth() &&
		    d1.getDate() === d2.getDate();
}