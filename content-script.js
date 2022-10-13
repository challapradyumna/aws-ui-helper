document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        arnToLinks = function() {
            document.querySelectorAll(".awsui-table-row").forEach(row => {
                var search = row.querySelector('span>span[title^="arn:aws:elasticloadbalancing"]')
                // console.log(search)
                if(search != null) {
                    var arnSplit = search.innerHTML.split(":")
                    // console.log(arnSplit)
                    // console.log(arnSplit[5].split("/"))
                    if(arnSplit[5].split("/")[0] == "loadbalancer" || arnSplit[5].split("/")[0] == "listener"){
                        var lbName = arnSplit[5].split("/")[2]
                        var lbLink = window.location.origin+"/ec2/home#LoadBalancers:search="+lbName+";sort=loadBalancerName";
                        var a = document.createElement('a');
                        a.setAttribute('href',lbLink);
                        a.setAttribute('target',"_blank");
                        a.innerHTML = search.innerHTML;
                        search.innerHTML = ""
                        search.appendChild(a)
                    }
                    else if(arnSplit[5].split("/")[0] == "targetgroup") {
                        var tgLink = window.location.origin+"/ec2/home#TargetGroup:targetGroupArn="+search.innerHTML;
                        var a = document.createElement('a');
                        a.setAttribute('href',tgLink);
                        a.setAttribute('target',"_blank");
                        a.innerHTML = search.innerHTML;
                        search.innerHTML = ""
                        search.appendChild(a)
                    }
                }
            })
        }
        observe = function() {
            // Select the node that will be observed for mutations
            const targetNodes = document.querySelectorAll('.cfn-details-table');

            // Options for the observer (which mutations to observe)
            const config = { attributes: true, childList: true, subtree: true };

            // Callback function to execute when mutations are observed
            const callback = (mutationList, observer) => {
                for (const mutation of mutationList) {
                    // console.log(mutation.type)
                    if (mutation.type === 'childList') {
                        // console.log(document.querySelectorAll(".awsui-table-row"))
                       arnToLinks()
                    }
                }
            };

            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(callback);

            // Start observing the target node for configured mutations
            targetNodes.forEach( (targetNode) => {
                observer.observe(targetNode, config);
            })
            
            // Later, you can stop observing
            // observer.disconnect();
        }
        //wait 2 seconds so that data can load 
        setTimeout(function () {
            arnToLinks()
        }, 2000);
        
        tabs = document.querySelectorAll('ul[role="tablist"]')
        tabs.forEach(tab => {
            tab.addEventListener("click", observe);
        });
    }
  }

