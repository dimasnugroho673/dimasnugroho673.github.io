function changeType(params) {
    var url = new URL(window.location);
    (url.searchParams.has('type') ? url.searchParams.set('type', params) : url.searchParams.append('type',
        "ios"));
    window.location = url;
}

function listing(type, items) {
    let listItems = ``

    listItems += type == 'tool' ? `<h6>Tools</h6>` : `<h6>Frameworks</h6>`

    items.forEach(item => {
       listItems += `<div class="list-project-plugin text-muted">${item.name}</div>`
    })

    return listItems
}

function jobListing(jobs) {
    let listItems = ``
    
    listItems += `<h6>Job Descriptions</h6>`
    
    jobs.forEach(job => {
        listItems += `<div class="list-project-plugin text-muted">${job}</div>`
    })

    return listItems
}

function createLink(type, href) {
    let imgBadge

    if (type != "link") {
        switch (type) {
            case "testflight":
                imgBadge = "./img/badge-testflight.png"
                break
            case "appstore-black":
                imgBadge = "./img/badge-appstore-black.png"
                break
            case "github-black":
                imgBadge = "./img/badge-github-black.png"
                break
            default:
                break
        }

        return `<h6>Link</h6>
            <a href="${href}" target="_blank" rel="noopener"><img src="${imgBadge}" width="170px" alt="img-link ${imgBadge}"></a>
        `
    } else {
        return `<h6>Link</h6>
        <div class="list-project-plugin text-muted"><a href="${href}" target="_blank" rel="noopener">${href}</a></div>
        `
    }
}

const urlParams = new URLSearchParams(window.location.search)
const projectType = urlParams.get('type')

let filePath

switch (projectType) {
    case "ios":
        $('.selected-project-type').html('iOS App')
        filePath = "iosProject.json"
        break
    case "web":
        $('.selected-project-type').html('Web App')
        filePath = "WebProject.json"
        break
    case "android":
        $('.selected-project-type').html('Android App')
        filePath = "AndroidProject.json"
        break
    default:
        break
}

fetch(`data/${filePath}`)
    .then(response => response.json())
    .then(json =>
        json.forEach(item => {
            $('.col-content-list').append(`
            <div class="col-md-4">
                <figure class="figure row-project" data-name="${item.name}" style="cursor: pointer">
                    <img src="${item.image != "" ? item.image : 'https://indrij.vercel.app/assets/project/usmile.png'}" class="figure-img img-fluid rounded shadow-sm" alt="...">

                    <h5>${item.name}</h5>
                </figure>
            </div>
        `)
        })
    )

$('.col-content-list').on('click', '.row-project', function () {
    let myModal = new bootstrap.Modal(document.getElementById('detailProjectModal'), {
        keyboard: false
    })

    myModal.show()

    let projectTitle = $(this).data("name")
    let projects
    let project = new Object()

    fetch(`data/${filePath}`)
        .then(response => response.json())
        .then(json => projects = json)
        .then(() => {
            project = projects.filter(project =>
                project.name.toLowerCase().includes(projectTitle.toLowerCase())
            )[0]
        })
        .then(() => {
            $('.modal-body-detail-project').html(`
                <li class="list-group mb-5 list-group-flush">
                            <div class="row">
                                <div class="col-lg-8">
                                    <small class="text-muted platform-project">${projectType == "ios" ? "iOS App" : projectType} &bull; ${project.role}</small>
                                    <p class="title-4 title-project">${project.name}</p>
                                    <p class="description-project">${project.descriptions}</p>
                                    
                                    <ul class="list-group list-group-flush project-plugin">
                                        <li class="list-group list-group-flush list-group-project mt-3">
                                            <li class="list-group list-group-flush list-group-project">${jobListing(project.jobDescriptions)}</li>
                                        </li>
                                    </ul>
                                   
                                </div>
                                <div class="col-lg-4">
                                    <ul class="list-group list-group-flush project-plugin">
                                        <li class="list-group list-group-flush list-group-project">${listing('tool', project.tools)}</li>

                                        <li class="list-group list-group-flush mt-3">${listing('framework', project.frameworks)}</li>

                                        <li class="list-group list-group-flush mt-3">${createLink(project.link.type, project.link.href)}</li>
                                    </ul>
                                </div>
                            </div>

                            <figure class="figure mt-4">
                                <img src="${project.image}" class="figure-img img-fluid rounded shadow" alt="project-img">
                            </figure>
                        </li>
                `)
        })
})