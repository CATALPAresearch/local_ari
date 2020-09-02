<!DOCTYPE html>
<html class="" lang="en">
<head prefix="og: http://ogp.me/ns#">
<meta charset="utf-8">
<meta content="IE=edge" http-equiv="X-UA-Compatible">

<meta content="object" property="og:type">
<meta content="GitLab" property="og:site_name">
<meta content="amd/tsc/core_indexeddb.ts · 4a11a582c417ca66ba15f3d2990265bd85cf69f8 · aple / Entwicklung / local-ari" property="og:title">
<meta content="Moodle local plugin that provides an Adaption Rule Interface (ARI)" property="og:description">
<meta content="https://gitlab.pi6.fernuni-hagen.de/assets/gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png" property="og:image">
<meta content="64" property="og:image:width">
<meta content="64" property="og:image:height">
<meta content="https://gitlab.pi6.fernuni-hagen.de/aple/entwicklung/ari/-/blob/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc/core_indexeddb.ts" property="og:url">
<meta content="summary" property="twitter:card">
<meta content="amd/tsc/core_indexeddb.ts · 4a11a582c417ca66ba15f3d2990265bd85cf69f8 · aple / Entwicklung / local-ari" property="twitter:title">
<meta content="Moodle local plugin that provides an Adaption Rule Interface (ARI)" property="twitter:description">
<meta content="https://gitlab.pi6.fernuni-hagen.de/assets/gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png" property="twitter:image">

<title>amd/tsc/core_indexeddb.ts · 4a11a582c417ca66ba15f3d2990265bd85cf69f8 · aple / Entwicklung / local-ari · GitLab</title>
<meta content="Moodle local plugin that provides an Adaption Rule Interface (ARI)" name="description">
<link rel="shortcut icon" type="image/png" href="/assets/favicon-7901bd695fb93edb07975966062049829afb56cf11511236e61bcf425070e36e.png" id="favicon" data-original-href="/assets/favicon-7901bd695fb93edb07975966062049829afb56cf11511236e61bcf425070e36e.png" />

<link rel="stylesheet" media="all" href="/assets/application-455d114267e5992b858fb725de1c1ddb83862890fe54436ffea5ff2d2f72edc8.css" />


<link rel="stylesheet" media="all" href="/assets/highlight/themes/dark-4cc9557f25ca3af5956cef153e6242f0c08171ba11f5da909cd949ef9205a221.css" />

<script type="text/javascript" src="https://ff.kis.v2.scr.kaspersky-labs.com/FD126C42-EBFA-4E12-B309-BB3FDD723AC1/main.js?attr=sNFUHiYvShS1v5nJTto9Bp7WciIs_kv1SRzsu0UtdXTLTwP4q82j0tEijr1MZCTb6tl0RaIXF3iI9_pSuDnCRMmNGTo5Jk1tYU7um27ggdDNO0v96RItZhWGsq_aJHPyudsb6njLCGwSFfvtQcLQGQEKavxmPsBM3Us3Wy1K7gbOW6ESYFo8CyWUNAMnF_3Hw-FeN258ldZYuRyp_mjLUw" charset="UTF-8"></script><script>
//<![CDATA[
window.gon={};gon.features={"codeNavigation":true};
//]]>
</script>


<script src="/assets/webpack/runtime.47b2a480.bundle.js" defer="defer"></script>
<script src="/assets/webpack/main.57f24f29.chunk.js" defer="defer"></script>
<script src="/assets/webpack/commons-pages.groups.milestones.edit-pages.groups.milestones.new-pages.projects.blame.show-pages.pro-b4ffa014.c990cf2c.chunk.js" defer="defer"></script>
<script src="/assets/webpack/commons-pages.admin.application_settings-pages.admin.application_settings.general-pages.admin.applic-1cc831a8.cfad7401.chunk.js" defer="defer"></script>
<script src="/assets/webpack/commons-pages.projects.blame.show-pages.projects.blob.edit-pages.projects.blob.new-pages.projects.bl-c6edf1dd.c9b27d86.chunk.js" defer="defer"></script>
<script src="/assets/webpack/pages.projects.blob.show.79fddd69.chunk.js" defer="defer"></script>

<script>
//<![CDATA[
window.uploads_path = "/aple/entwicklung/ari/uploads";



//]]>
</script>
<meta name="csrf-param" content="authenticity_token" />
<meta name="csrf-token" content="CZEKAwoi3dxVkp8stpucXUuQgPeB745q1m831rgOeZR4p1b1UoORSkpDrOZ89kLT9L2OpuhXem6lhR/FQ2VbqQ==" />
<meta name="csp-nonce" />
<meta name="action-cable-url" content="/-/cable" />
<meta content="origin-when-cross-origin" name="referrer">
<meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport">
<meta content="#474D57" name="theme-color">
<link rel="apple-touch-icon" type="image/x-icon" href="/assets/touch-icon-iphone-5a9cee0e8a51212e70b90c87c12f382c428870c0ff67d1eb034d884b78d2dae7.png" />
<link rel="apple-touch-icon" type="image/x-icon" href="/assets/touch-icon-ipad-a6eec6aeb9da138e507593b464fdac213047e49d3093fc30e90d9a995df83ba3.png" sizes="76x76" />
<link rel="apple-touch-icon" type="image/x-icon" href="/assets/touch-icon-iphone-retina-72e2aadf86513a56e050e7f0f2355deaa19cc17ed97bbe5147847f2748e5a3e3.png" sizes="120x120" />
<link rel="apple-touch-icon" type="image/x-icon" href="/assets/touch-icon-ipad-retina-8ebe416f5313483d9c1bc772b5bbe03ecad52a54eba443e5215a22caed2a16a2.png" sizes="152x152" />
<link color="rgb(226, 67, 41)" href="/assets/logo-d36b5212042cebc89b96df4bf6ac24e43db316143e89926c0db839ff694d2de4.svg" rel="mask-icon">
<meta content="/assets/msapplication-tile-1196ec67452f618d39cdd85e2e3a542f76574c071051ae7effbfde01710eb17d.png" name="msapplication-TileImage">
<meta content="#30353E" name="msapplication-TileColor">




</head>

<body class="ui-indigo tab-width-8  gl-browser-firefox gl-platform-windows" data-find-file="/aple/entwicklung/ari/-/find_file/4a11a582c417ca66ba15f3d2990265bd85cf69f8" data-group="entwicklung" data-namespace-id="109" data-page="projects:blob:show" data-page-type-id="4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc/core_indexeddb.ts" data-project="ari" data-project-id="155">

<script>
//<![CDATA[
gl = window.gl || {};
gl.client = {"isFirefox":true,"isWindows":true};


//]]>
</script>


<header class="navbar navbar-gitlab navbar-expand-sm js-navbar" data-qa-selector="navbar">
<a class="sr-only gl-accessibility" href="#content-body" tabindex="1">Skip to content</a>
<div class="container-fluid">
<div class="header-content">
<div class="title-container">
<h1 class="title">
<span class="gl-sr-only">GitLab</span>
<a title="Dashboard" id="logo" href="/"><svg width="24" height="24" class="tanuki-logo" viewBox="0 0 36 36">
  <path class="tanuki-shape tanuki-left-ear" fill="#e24329" d="M2 14l9.38 9v-9l-4-12.28c-.205-.632-1.176-.632-1.38 0z"/>
  <path class="tanuki-shape tanuki-right-ear" fill="#e24329" d="M34 14l-9.38 9v-9l4-12.28c.205-.632 1.176-.632 1.38 0z"/>
  <path class="tanuki-shape tanuki-nose" fill="#e24329" d="M18,34.38 3,14 33,14 Z"/>
  <path class="tanuki-shape tanuki-left-eye" fill="#fc6d26" d="M18,34.38 11.38,14 2,14 6,25Z"/>
  <path class="tanuki-shape tanuki-right-eye" fill="#fc6d26" d="M18,34.38 24.62,14 34,14 30,25Z"/>
  <path class="tanuki-shape tanuki-left-cheek" fill="#fca326" d="M2 14L.1 20.16c-.18.565 0 1.2.5 1.56l17.42 12.66z"/>
  <path class="tanuki-shape tanuki-right-cheek" fill="#fca326" d="M34 14l1.9 6.16c.18.565 0 1.2-.5 1.56L18 34.38z"/>
</svg>

<span class="logo-text d-none d-lg-block gl-ml-3">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 617 169"><path d="M315.26 2.97h-21.8l.1 162.5h88.3v-20.1h-66.5l-.1-142.4M465.89 136.95c-5.5 5.7-14.6 11.4-27 11.4-16.6 0-23.3-8.2-23.3-18.9 0-16.1 11.2-23.8 35-23.8 4.5 0 11.7.5 15.4 1.2v30.1h-.1m-22.6-98.5c-17.6 0-33.8 6.2-46.4 16.7l7.7 13.4c8.9-5.2 19.8-10.4 35.5-10.4 17.9 0 25.8 9.2 25.8 24.6v7.9c-3.5-.7-10.7-1.2-15.1-1.2-38.2 0-57.6 13.4-57.6 41.4 0 25.1 15.4 37.7 38.7 37.7 15.7 0 30.8-7.2 36-18.9l4 15.9h15.4v-83.2c-.1-26.3-11.5-43.9-44-43.9M557.63 149.1c-8.2 0-15.4-1-20.8-3.5V70.5c7.4-6.2 16.6-10.7 28.3-10.7 21.1 0 29.2 14.9 29.2 39 0 34.2-13.1 50.3-36.7 50.3m9.2-110.6c-19.5 0-30 13.3-30 13.3v-21l-.1-27.8h-21.3l.1 158.5c10.7 4.5 25.3 6.9 41.2 6.9 40.7 0 60.3-26 60.3-70.9-.1-35.5-18.2-59-50.2-59M77.9 20.6c19.3 0 31.8 6.4 39.9 12.9l9.4-16.3C114.5 6 97.3 0 78.9 0 32.5 0 0 28.3 0 85.4c0 59.8 35.1 83.1 75.2 83.1 20.1 0 37.2-4.7 48.4-9.4l-.5-63.9V75.1H63.6v20.1h38l.5 48.5c-5 2.5-13.6 4.5-25.3 4.5-32.2 0-53.8-20.3-53.8-63-.1-43.5 22.2-64.6 54.9-64.6M231.43 2.95h-21.3l.1 27.3v94.3c0 26.3 11.4 43.9 43.9 43.9 4.5 0 8.9-.4 13.1-1.2v-19.1c-3.1.5-6.4.7-9.9.7-17.9 0-25.8-9.2-25.8-24.6v-65h35.7v-17.8h-35.7l-.1-38.5M155.96 165.47h21.3v-124h-21.3v124M155.96 24.37h21.3V3.07h-21.3v21.3"/></svg>

</span>
</a></h1>
<ul class="list-unstyled navbar-sub-nav">
<li id="nav-projects-dropdown" class="home dropdown header-projects qa-projects-dropdown" data-track-label="projects_dropdown" data-track-event="click_dropdown" data-track-value=""><button class="btn" data-toggle="dropdown" type="button">
Projects
<svg class="s16 caret-down" data-testid="angle-down-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#angle-down"></use></svg>
</button>
<div class="dropdown-menu frequent-items-dropdown-menu">
<div class="frequent-items-dropdown-container">
<div class="frequent-items-dropdown-sidebar qa-projects-dropdown-sidebar">
<ul>
<li class=""><a class="qa-your-projects-link" href="/dashboard/projects">Your projects
</a></li><li class=""><a href="/dashboard/projects/starred">Starred projects
</a></li><li class=""><a href="/explore">Explore projects
</a></li></ul>
</div>
<div class="frequent-items-dropdown-content">
<div data-project-id="155" data-project-name="local-ari" data-project-namespace="aple / Entwicklung / local-ari" data-project-web-url="/aple/entwicklung/ari" data-user-name="MarcBurchart" id="js-projects-dropdown"></div>
</div>
</div>

</div>
</li><li id="nav-groups-dropdown" class="d-none d-md-block home dropdown header-groups qa-groups-dropdown" data-track-label="groups_dropdown" data-track-event="click_dropdown" data-track-value=""><button class="btn" data-toggle="dropdown" type="button">
Groups
<svg class="s16 caret-down" data-testid="angle-down-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#angle-down"></use></svg>
</button>
<div class="dropdown-menu frequent-items-dropdown-menu">
<div class="frequent-items-dropdown-container">
<div class="frequent-items-dropdown-sidebar qa-groups-dropdown-sidebar">
<ul>
<li class=""><a class="qa-your-groups-link" href="/dashboard/groups">Your groups
</a></li><li class=""><a href="/explore/groups">Explore groups
</a></li></ul>
</div>
<div class="frequent-items-dropdown-content">
<div data-user-name="MarcBurchart" id="js-groups-dropdown"></div>
</div>
</div>

</div>
</li><li class="header-more dropdown">
<a data-qa-selector="more_dropdown" data-toggle="dropdown" href="#">
More
<svg class="s16 caret-down" data-testid="angle-down-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#angle-down"></use></svg>
</a>
<div class="dropdown-menu">
<ul>
<li class="d-md-none">
<a class="dashboard-shortcuts-groups" data-qa-selector="groups_link" href="/dashboard/groups">Groups
</a></li>
<li class=""><a class="dashboard-shortcuts-activity" data-qa-selector="activity_link" href="/dashboard/activity">Activity
</a></li><li class=""><a class="dashboard-shortcuts-milestones" data-qa-selector="milestones_link" href="/dashboard/milestones">Milestones
</a></li><li class=""><a class="dashboard-shortcuts-snippets" data-qa-selector="snippets_link" href="/dashboard/snippets">Snippets
</a></li><li class=""><a class="d-xl-none" href="/-/instance_statistics">Analytics
</a></li>
<li class="dropdown">

</li>
</ul>
</div>
</li>
<li class="d-none d-xl-block"><a class="chart-icon" title="Analytics" aria-label="Analytics" data-toggle="tooltip" data-placement="bottom" data-container="body" href="/-/instance_statistics"><svg class="s18" data-testid="chart-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#chart"></use></svg>
</a></li>
<li class="hidden">
<a class="dashboard-shortcuts-projects" href="/dashboard/projects">Projects
</a></li>

</ul>

</div>
<div class="navbar-collapse collapse">
<ul class="nav navbar-nav">
<li class="header-new dropdown" data-track-event="click_dropdown" data-track-label="new_dropdown" data-track-value="">
<a class="header-new-dropdown-toggle has-tooltip qa-new-menu-toggle" id="js-onboarding-new-project-link" title="New..." ref="tooltip" aria-label="New..." data-toggle="dropdown" data-placement="bottom" data-container="body" data-display="static" href="/projects/new"><svg class="s16" data-testid="plus-square-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#plus-square"></use></svg>
<svg class="s16 caret-down" data-testid="angle-down-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#angle-down"></use></svg>
</a><div class="dropdown-menu dropdown-menu-right">
<ul>
<li class="dropdown-bold-header">
This project
</li>
<li><a href="/aple/entwicklung/ari/-/issues/new">New issue</a></li>
<li><a href="/aple/entwicklung/ari/-/merge_requests/new">New merge request</a></li>
<li><a href="/aple/entwicklung/ari/-/snippets/new">New snippet</a></li>
<li class="divider"></li>
<li class="dropdown-bold-header">GitLab</li>
<li><a class="qa-global-new-project-link" href="/projects/new">New project</a></li>
<li><a href="/groups/new">New group</a></li>
<li><a class="qa-global-new-snippet-link" href="/-/snippets/new">New snippet</a></li>
</ul>
</div>
</li>

<li class="nav-item d-none d-lg-block m-auto">
<div class="search search-form" data-track-event="activate_form_input" data-track-label="navbar_search" data-track-value="">
<form class="form-inline" action="/search" accept-charset="UTF-8" method="get"><input name="utf8" type="hidden" value="&#x2713;" /><div class="search-input-container">
<div class="search-input-wrap">
<div class="dropdown" data-url="/search/autocomplete">
<input type="search" name="search" id="search" placeholder="Search or jump to…" class="search-input dropdown-menu-toggle no-outline js-search-dashboard-options" spellcheck="false" tabindex="1" autocomplete="off" data-issues-path="/dashboard/issues" data-mr-path="/dashboard/merge_requests" data-qa-selector="search_term_field" aria-label="Search or jump to…" />
<button class="hidden js-dropdown-search-toggle" data-toggle="dropdown" type="button"></button>
<div class="dropdown-menu dropdown-select js-dashboard-search-options">
<div class="dropdown-content"><ul>
<li class="dropdown-menu-empty-item">
<a>
Loading...
</a>
</li>
</ul>
</div><div class="dropdown-loading"><i aria-hidden="true" data-hidden="true" class="fa fa-spinner fa-spin"></i></div>
</div>
<svg class="s16 search-icon" data-testid="search-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#search"></use></svg>
<svg class="s16 clear-icon js-clear-input" data-testid="close-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#close"></use></svg>
</div>
</div>
</div>
<input type="hidden" name="group_id" id="group_id" value="109" class="js-search-group-options" data-group-path="entwicklung" data-name="Entwicklung" data-issues-path="/groups/aple/entwicklung/-/issues" data-mr-path="/groups/aple/entwicklung/-/merge_requests" />
<input type="hidden" name="project_id" id="search_project_id" value="155" class="js-search-project-options" data-project-path="ari" data-name="local-ari" data-issues-path="/aple/entwicklung/ari/-/issues" data-mr-path="/aple/entwicklung/ari/-/merge_requests" data-issues-disabled="false" />
<input type="hidden" name="scope" id="scope" />
<input type="hidden" name="search_code" id="search_code" value="true" />
<input type="hidden" name="snippets" id="snippets" value="false" />
<input type="hidden" name="repository_ref" id="repository_ref" value="4a11a582c417ca66ba15f3d2990265bd85cf69f8" />
<input type="hidden" name="nav_source" id="nav_source" value="navbar" />
<div class="search-autocomplete-opts hide" data-autocomplete-path="/search/autocomplete" data-autocomplete-project-id="155" data-autocomplete-project-ref="4a11a582c417ca66ba15f3d2990265bd85cf69f8"></div>
</form></div>

</li>
<li class="nav-item d-inline-block d-lg-none">
<a title="Search" aria-label="Search" data-toggle="tooltip" data-placement="bottom" data-container="body" href="/search?project_id=155"><svg class="s16" data-testid="search-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#search"></use></svg>
</a></li>
<li class="user-counter"><a title="Issues" class="dashboard-shortcuts-issues" aria-label="Issues" data-qa-selector="issues_shortcut_button" data-toggle="tooltip" data-placement="bottom" data-track-label="main_navigation" data-track-event="click_issues_link" data-track-property="navigation" data-container="body" href="/dashboard/issues?assignee_username=MarcBurchart"><svg class="s16" data-testid="issues-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#issues"></use></svg>
<span class="badge badge-pill green-badge issues-count">
4
</span>
</a></li><li class="user-counter"><a title="Merge requests" class="dashboard-shortcuts-merge_requests" aria-label="Merge requests" data-qa-selector="merge_requests_shortcut_button" data-toggle="tooltip" data-placement="bottom" data-track-label="main_navigation" data-track-event="click_merge_link" data-track-property="navigation" data-container="body" href="/dashboard/merge_requests?assignee_username=MarcBurchart"><svg class="s16" data-testid="git-merge-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#git-merge"></use></svg>
<span class="badge badge-pill hidden merge-requests-count">
0
</span>
</a></li><li class="user-counter"><a title="To-Do List" aria-label="To-Do List" class="shortcuts-todos" data-qa-selector="todos_shortcut_button" data-toggle="tooltip" data-placement="bottom" data-track-label="main_navigation" data-track-event="click_to_do_link" data-track-property="navigation" data-container="body" href="/dashboard/todos"><svg class="s16" data-testid="todo-done-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#todo-done"></use></svg>
<span class="badge badge-pill hidden todos-count">
0
</span>
</a></li><li class="nav-item header-help dropdown d-none d-md-block">
<a class="header-help-dropdown-toggle" data-toggle="dropdown" href="/help"><span class="gl-sr-only">
Help
</span>
<svg class="s16" data-testid="question-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#question"></use></svg>
<svg class="s16 caret-down" data-testid="angle-down-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#angle-down"></use></svg>
</a><div class="dropdown-menu dropdown-menu-right">
<ul>

<li>
<a href="/help">Help</a>
</li>
<li>
<a href="https://about.gitlab.com/getting-help/">Support</a>
</li>
<li>
<button class="js-shortcuts-modal-trigger" type="button">
Keyboard shortcuts
<span aria-hidden class="text-secondary float-right">?</span>
</button>
</li>
<li class="divider"></li>
<li>
<a href="https://about.gitlab.com/submit-feedback">Submit feedback</a>
</li>
<li>
<a target="_blank" class="text-nowrap" href="https://about.gitlab.com/contributing">Contribute to GitLab
</a>
</li>

</ul>

</div>
</li>
<li class="dropdown header-user js-nav-user-dropdown nav-item" data-qa-selector="user_menu" data-track-event="click_dropdown" data-track-label="profile_dropdown" data-track-value="">
<a class="header-user-dropdown-toggle" data-toggle="dropdown" href="/MarcBurchart"><img width="23" height="23" class="header-user-avatar qa-user-avatar lazy" alt="Marc Burchart" data-src="/uploads/-/system/user/avatar/84/avatar.png?width=23" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />

<svg class="s16 caret-down" data-testid="angle-down-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#angle-down"></use></svg>
</a><div class="dropdown-menu dropdown-menu-right">
<ul>
<li class="current-user">
<div class="user-name bold">
Marc Burchart
</div>
@MarcBurchart
</li>
<li class="divider"></li>
<li>
<div class="js-set-status-modal-trigger" data-has-status="false"></div>
</li>
<li>
<a class="profile-link" data-user="MarcBurchart" href="/MarcBurchart">Profile</a>
</li>
<li>
<a data-qa-selector="settings_link" href="/profile">Settings</a>
</li>


<li class="divider d-md-none"></li>
<li class="d-md-none">
<a href="/help">Help</a>
</li>
<li class="d-md-none">
<a href="https://about.gitlab.com/getting-help/">Support</a>
</li>
<li class="d-md-none">
<a href="https://about.gitlab.com/submit-feedback">Submit feedback</a>
</li>
<li class="d-md-none">
<a target="_blank" class="text-nowrap" href="https://about.gitlab.com/contributing">Contribute to GitLab
</a>
</li>

<li class="divider"></li>
<li>
<a class="sign-out-link" data-qa-selector="sign_out_link" rel="nofollow" data-method="post" href="/users/sign_out">Sign out</a>
</li>
</ul>

</div>
</li>
</ul>
</div>
<button class="navbar-toggler d-block d-sm-none" type="button">
<span class="sr-only">Toggle navigation</span>
<svg class="s12 more-icon js-navbar-toggle-right" data-testid="ellipsis_h-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#ellipsis_h"></use></svg>
<svg class="s12 close-icon js-navbar-toggle-left" data-testid="close-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#close"></use></svg>
</button>
</div>
</div>
</header>
<div class="js-set-status-modal-wrapper" data-current-emoji="" data-current-message=""></div>

<div class="layout-page page-with-contextual-sidebar">
<div class="nav-sidebar">
<div class="nav-sidebar-inner-scroll">
<div class="context-header">
<a title="local-ari" href="/aple/entwicklung/ari"><div class="avatar-container rect-avatar s40 project-avatar">
<div class="avatar s40 avatar-tile identicon bg2">L</div>
</div>
<div class="sidebar-context-title">
local-ari
</div>
</a></div>
<ul class="sidebar-top-level-items qa-project-sidebar">
<li class="home"><a class="shortcuts-project rspec-project-link" data-qa-selector="project_link" href="/aple/entwicklung/ari"><div class="nav-icon-container">
<svg class="s16" data-testid="home-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#home"></use></svg>
</div>
<span class="nav-item-name">
Project overview
</span>
</a><ul class="sidebar-sub-level-items">
<li class="fly-out-top-item"><a href="/aple/entwicklung/ari"><strong class="fly-out-top-item-name">
Project overview
</strong>
</a></li><li class="divider fly-out-top-item"></li>
<li class=""><a title="Project details" class="shortcuts-project" href="/aple/entwicklung/ari"><span>Details</span>
</a></li><li class=""><a title="Activity" class="shortcuts-project-activity" data-qa-selector="activity_link" href="/aple/entwicklung/ari/activity"><span>Activity</span>
</a></li><li class=""><a title="Releases" class="shortcuts-project-releases" href="/aple/entwicklung/ari/-/releases"><span>Releases</span>
</a></li></ul>
</li><li class="active"><a class="shortcuts-tree" data-qa-selector="repository_link" href="/aple/entwicklung/ari/-/tree/4a11a582c417ca66ba15f3d2990265bd85cf69f8"><div class="nav-icon-container">
<svg class="s16" data-testid="doc-text-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#doc-text"></use></svg>
</div>
<span class="nav-item-name" id="js-onboarding-repo-link">
Repository
</span>
</a><ul class="sidebar-sub-level-items">
<li class="fly-out-top-item active"><a href="/aple/entwicklung/ari/-/tree/4a11a582c417ca66ba15f3d2990265bd85cf69f8"><strong class="fly-out-top-item-name">
Repository
</strong>
</a></li><li class="divider fly-out-top-item"></li>
<li class="active"><a href="/aple/entwicklung/ari/-/tree/4a11a582c417ca66ba15f3d2990265bd85cf69f8">Files
</a></li><li class=""><a id="js-onboarding-commits-link" href="/aple/entwicklung/ari/-/commits/4a11a582c417ca66ba15f3d2990265bd85cf69f8">Commits
</a></li><li class=""><a data-qa-selector="branches_link" id="js-onboarding-branches-link" href="/aple/entwicklung/ari/-/branches">Branches
</a></li><li class=""><a data-qa-selector="tags_link" href="/aple/entwicklung/ari/-/tags">Tags
</a></li><li class=""><a href="/aple/entwicklung/ari/-/graphs/4a11a582c417ca66ba15f3d2990265bd85cf69f8">Contributors
</a></li><li class=""><a href="/aple/entwicklung/ari/-/network/4a11a582c417ca66ba15f3d2990265bd85cf69f8">Graph
</a></li><li class=""><a href="/aple/entwicklung/ari/-/compare?from=master&amp;to=4a11a582c417ca66ba15f3d2990265bd85cf69f8">Compare
</a></li>
</ul>
</li><li class=""><a class="shortcuts-issues qa-issues-item" href="/aple/entwicklung/ari/-/issues"><div class="nav-icon-container">
<svg class="s16" data-testid="issues-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#issues"></use></svg>
</div>
<span class="nav-item-name" id="js-onboarding-issues-link">
Issues
</span>
<span class="badge badge-pill count issue_counter">
1
</span>
</a><ul class="sidebar-sub-level-items">
<li class="fly-out-top-item"><a href="/aple/entwicklung/ari/-/issues"><strong class="fly-out-top-item-name">
Issues
</strong>
<span class="badge badge-pill count issue_counter fly-out-badge">
1
</span>
</a></li><li class="divider fly-out-top-item"></li>
<li class=""><a title="Issues" href="/aple/entwicklung/ari/-/issues"><span>
List
</span>
</a></li><li class=""><a title="Boards" data-qa-selector="issue_boards_link" href="/aple/entwicklung/ari/-/boards"><span>
Boards
</span>
</a></li><li class=""><a title="Labels" class="qa-labels-link" href="/aple/entwicklung/ari/-/labels"><span>
Labels
</span>
</a></li><li class=""><a title="Service Desk" href="/aple/entwicklung/ari/-/issues/service_desk">Service Desk
</a></li>
<li class=""><a title="Milestones" class="qa-milestones-link" href="/aple/entwicklung/ari/-/milestones"><span>
Milestones
</span>
</a></li>
</ul>
</li><li class=""><a class="shortcuts-merge_requests" data-qa-selector="merge_requests_link" href="/aple/entwicklung/ari/-/merge_requests"><div class="nav-icon-container">
<svg class="s16" data-testid="git-merge-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#git-merge"></use></svg>
</div>
<span class="nav-item-name" id="js-onboarding-mr-link">
Merge Requests
</span>
<span class="badge badge-pill count merge_counter js-merge-counter">
0
</span>
</a><ul class="sidebar-sub-level-items is-fly-out-only">
<li class="fly-out-top-item"><a href="/aple/entwicklung/ari/-/merge_requests"><strong class="fly-out-top-item-name">
Merge Requests
</strong>
<span class="badge badge-pill count merge_counter js-merge-counter fly-out-badge">
0
</span>
</a></li></ul>
</li>
<li class=""><a class="shortcuts-pipelines qa-link-pipelines rspec-link-pipelines" data-qa-selector="ci_cd_link" href="/aple/entwicklung/ari/-/pipelines"><div class="nav-icon-container">
<svg class="s16" data-testid="rocket-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#rocket"></use></svg>
</div>
<span class="nav-item-name" id="js-onboarding-pipelines-link">
CI / CD
</span>
</a><ul class="sidebar-sub-level-items">
<li class="fly-out-top-item"><a href="/aple/entwicklung/ari/-/pipelines"><strong class="fly-out-top-item-name">
CI / CD
</strong>
</a></li><li class="divider fly-out-top-item"></li>
<li class=""><a title="Pipelines" class="shortcuts-pipelines" href="/aple/entwicklung/ari/-/pipelines"><span>
Pipelines
</span>
</a></li><li class=""><a title="Jobs" class="shortcuts-builds" href="/aple/entwicklung/ari/-/jobs"><span>
Jobs
</span>
</a></li><li class=""><a title="Schedules" class="shortcuts-builds" href="/aple/entwicklung/ari/-/pipeline_schedules"><span>
Schedules
</span>
</a></li></ul>
</li>
<li class=""><a class="shortcuts-operations" data-qa-selector="operations_link" href="/aple/entwicklung/ari/-/environments/metrics"><div class="nav-icon-container">
<svg class="s16" data-testid="cloud-gear-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#cloud-gear"></use></svg>
</div>
<span class="nav-item-name">
Operations
</span>
</a><ul class="sidebar-sub-level-items">
<li class="fly-out-top-item"><a href="/aple/entwicklung/ari/-/environments/metrics"><strong class="fly-out-top-item-name">
Operations
</strong>
</a></li><li class="divider fly-out-top-item"></li>
<li class=""><a title="Metrics" class="shortcuts-metrics" data-qa-selector="operations_metrics_link" href="/aple/entwicklung/ari/-/metrics"><span>
Metrics
</span>
</a></li><li class=""><a title="Alerts" href="/aple/entwicklung/ari/-/alert_management"><span>
Alerts
</span>
</a></li><li class=""><a title="Incidents" data-qa-selector="operations_incidents_link" href="/aple/entwicklung/ari/-/incidents"><span>
Incidents
</span>
</a></li>
<li class=""><a title="Environments" class="shortcuts-environments qa-operations-environments-link" href="/aple/entwicklung/ari/-/environments"><span>
Environments
</span>
</a></li><li class=""><a title="Error Tracking" href="/aple/entwicklung/ari/-/error_tracking"><span>
Error Tracking
</span>
</a></li><li class=""><a title="Serverless" href="/aple/entwicklung/ari/-/serverless/functions"><span>
Serverless
</span>
</a></li><li class=""><a title="Logs" href="/aple/entwicklung/ari/-/logs"><span>
Logs
</span>
</a></li><li class=""><a title="Kubernetes" class="shortcuts-kubernetes" href="/aple/entwicklung/ari/-/clusters"><span>
Kubernetes
</span>
</a></li>
</ul>
</li>
<li class=""><a data-qa-selector="analytics_anchor" href="/aple/entwicklung/ari/-/value_stream_analytics"><div class="nav-icon-container">
<svg class="s16" data-testid="chart-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#chart"></use></svg>
</div>
<span class="nav-item-name" data-qa-selector="analytics_link">
Analytics
</span>
</a><ul class="sidebar-sub-level-items" data-qa-selector="analytics_sidebar_submenu">
<li class="fly-out-top-item"><a href="/aple/entwicklung/ari/-/value_stream_analytics"><strong class="fly-out-top-item-name">
Analytics
</strong>
</a></li><li class="divider fly-out-top-item"></li>
<li class=""><a title="CI / CD" href="/aple/entwicklung/ari/-/pipelines/charts"><span>CI / CD</span>
</a></li><li class=""><a class="shortcuts-repository-charts" title="Repository" href="/aple/entwicklung/ari/-/graphs/4a11a582c417ca66ba15f3d2990265bd85cf69f8/charts"><span>Repository</span>
</a></li><li class=""><a class="shortcuts-project-cycle-analytics" title="Value Stream" href="/aple/entwicklung/ari/-/value_stream_analytics"><span>Value Stream</span>
</a></li></ul>
</li>
<li class=""><a class="shortcuts-wiki" data-qa-selector="wiki_link" href="/aple/entwicklung/ari/-/wikis/home"><div class="nav-icon-container">
<svg class="s16" data-testid="book-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#book"></use></svg>
</div>
<span class="nav-item-name">
Wiki
</span>
</a><ul class="sidebar-sub-level-items is-fly-out-only">
<li class="fly-out-top-item"><a href="/aple/entwicklung/ari/-/wikis/home"><strong class="fly-out-top-item-name">
Wiki
</strong>
</a></li></ul>
</li>
<li class=""><a class="shortcuts-snippets" data-qa-selector="snippets_link" href="/aple/entwicklung/ari/-/snippets"><div class="nav-icon-container">
<svg class="s16" data-testid="snippet-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#snippet"></use></svg>
</div>
<span class="nav-item-name">
Snippets
</span>
</a><ul class="sidebar-sub-level-items is-fly-out-only">
<li class="fly-out-top-item"><a href="/aple/entwicklung/ari/-/snippets"><strong class="fly-out-top-item-name">
Snippets
</strong>
</a></li></ul>
</li><li class=""><a title="Members" class="qa-members-link" id="js-onboarding-members-link" href="/aple/entwicklung/ari/-/project_members"><div class="nav-icon-container">
<svg class="s16" data-testid="users-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#users"></use></svg>
</div>
<span class="nav-item-name">
Members
</span>
</a><ul class="sidebar-sub-level-items is-fly-out-only">
<li class="fly-out-top-item"><a href="/aple/entwicklung/ari/-/project_members"><strong class="fly-out-top-item-name">
Members
</strong>
</a></li></ul>
</li><li class=""><a href="/aple/entwicklung/ari/edit"><div class="nav-icon-container">
<svg class="s16" data-testid="settings-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#settings"></use></svg>
</div>
<span class="nav-item-name qa-settings-item" id="js-onboarding-settings-link">
Settings
</span>
</a><ul class="sidebar-sub-level-items">
<li class="fly-out-top-item"><a href="/aple/entwicklung/ari/edit"><strong class="fly-out-top-item-name">
Settings
</strong>
</a></li><li class="divider fly-out-top-item"></li>
<li class=""><a title="General" class="qa-general-settings-link" href="/aple/entwicklung/ari/edit"><span>
General
</span>
</a></li><li class=""><a title="Integrations" data-qa-selector="integrations_settings_link" href="/aple/entwicklung/ari/-/settings/integrations"><span>
Integrations
</span>
</a></li><li class=""><a title="Webhooks" data-qa-selector="webhooks_settings_link" href="/aple/entwicklung/ari/hooks"><span>
Webhooks
</span>
</a></li><li class=""><a title="Access Tokens" data-qa-selector="access_tokens_settings_link" href="/aple/entwicklung/ari/-/settings/access_tokens"><span>
Access Tokens
</span>
</a></li><li class=""><a title="Repository" href="/aple/entwicklung/ari/-/settings/repository"><span>
Repository
</span>
</a></li><li class=""><a title="CI / CD" href="/aple/entwicklung/ari/-/settings/ci_cd"><span>
CI / CD
</span>
</a></li><li class=""><a title="Operations" data-qa-selector="operations_settings_link" href="/aple/entwicklung/ari/-/settings/operations">Operations
</a></li>
</ul>
</li><a class="toggle-sidebar-button js-toggle-sidebar qa-toggle-sidebar rspec-toggle-sidebar" role="button" title="Toggle sidebar" type="button">
<svg class="s16 icon-chevron-double-lg-left" data-testid="chevron-double-lg-left-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#chevron-double-lg-left"></use></svg>
<svg class="s16 icon-chevron-double-lg-right" data-testid="chevron-double-lg-right-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#chevron-double-lg-right"></use></svg>
<span class="collapse-text">Collapse sidebar</span>
</a>
<button name="button" type="button" class="close-nav-button"><svg class="s16" data-testid="close-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#close"></use></svg>
<span class="collapse-text">Close sidebar</span>
</button>
<li class="hidden">
<a title="Activity" class="shortcuts-project-activity" href="/aple/entwicklung/ari/activity"><span>
Activity
</span>
</a></li>
<li class="hidden">
<a title="Network" class="shortcuts-network" href="/aple/entwicklung/ari/-/network/4a11a582c417ca66ba15f3d2990265bd85cf69f8">Graph
</a></li>
<li class="hidden">
<a class="shortcuts-new-issue" href="/aple/entwicklung/ari/-/issues/new">Create a new issue
</a></li>
<li class="hidden">
<a title="Jobs" class="shortcuts-builds" href="/aple/entwicklung/ari/-/jobs">Jobs
</a></li>
<li class="hidden">
<a title="Commits" class="shortcuts-commits" href="/aple/entwicklung/ari/-/commits/4a11a582c417ca66ba15f3d2990265bd85cf69f8">Commits
</a></li>
<li class="hidden">
<a title="Issue Boards" class="shortcuts-issue-boards" href="/aple/entwicklung/ari/-/boards">Issue Boards</a>
</li>
</ul>
</div>
</div>

<div class="content-wrapper">
<div class="mobile-overlay"></div>
<div class="alert-wrapper">














<nav class="breadcrumbs container-fluid container-limited" role="navigation">
<div class="breadcrumbs-container">
<button name="button" type="button" class="toggle-mobile-nav"><span class="sr-only">Open sidebar</span>
<svg class="s16" data-testid="hamburger-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#hamburger"></use></svg>
</button><div class="breadcrumbs-links js-title-container" data-qa-selector="breadcrumb_links_content">
<ul class="list-unstyled breadcrumbs-list js-breadcrumbs-list">
<li><a class="group-path breadcrumb-item-text js-breadcrumb-item-text " href="/aple">aple</a><svg class="s8 breadcrumbs-list-angle" data-testid="angle-right-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#angle-right"></use></svg></li><li><a class="group-path breadcrumb-item-text js-breadcrumb-item-text " href="/aple/entwicklung">Entwicklung</a><svg class="s8 breadcrumbs-list-angle" data-testid="angle-right-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#angle-right"></use></svg></li> <li><a href="/aple/entwicklung/ari"><span class="breadcrumb-item-text js-breadcrumb-item-text">local-ari</span></a><svg class="s8 breadcrumbs-list-angle" data-testid="angle-right-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#angle-right"></use></svg></li>

<li>
<h2 class="breadcrumbs-sub-title"><a href="/aple/entwicklung/ari/-/blob/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc/core_indexeddb.ts">Repository</a></h2>
</li>
</ul>
</div>

</div>
</nav>

<div class="d-flex"></div>
</div>
<div class="container-fluid container-limited ">
<div class="content" id="content-body">
<div class="flash-container flash-container-page sticky">
</div>

<div class="js-signature-container" data-signatures-path="/aple/entwicklung/ari/-/commits/250afc5191845e34d1804409c1f851c1e1ccbf53/signatures?limit=1"></div>

<div class="tree-holder" id="tree-holder">
<div class="nav-block">
<div class="tree-ref-container">
<div class="tree-ref-holder">
<form class="project-refs-form" action="/aple/entwicklung/ari/-/refs/switch" accept-charset="UTF-8" method="get"><input name="utf8" type="hidden" value="&#x2713;" /><input type="hidden" name="destination" id="destination" value="blob" />
<input type="hidden" name="path" id="path" value="amd/tsc/core_indexeddb.ts" />
<div class="dropdown">
<button class="dropdown-menu-toggle js-project-refs-dropdown qa-branches-select" type="button" data-toggle="dropdown" data-selected="4a11a582c417ca66ba15f3d2990265bd85cf69f8" data-ref="4a11a582c417ca66ba15f3d2990265bd85cf69f8" data-refs-url="/aple/entwicklung/ari/refs?sort=updated_desc" data-field-name="ref" data-submit-form-on-click="true" data-visit="true"><span class="dropdown-toggle-text ">4a11a582c417ca66ba15f3d2990265bd85cf69f8</span><i aria-hidden="true" data-hidden="true" class="fa fa-chevron-down"></i></button>
<div class="dropdown-menu dropdown-menu-paging dropdown-menu-selectable git-revision-dropdown qa-branches-dropdown">
<div class="dropdown-page-one">
<div class="dropdown-title"><span>Switch branch/tag</span><button class="dropdown-title-button dropdown-menu-close" aria-label="Close" type="button"><i aria-hidden="true" data-hidden="true" class="fa fa-times dropdown-menu-close-icon"></i></button></div>
<div class="dropdown-input"><input type="search" id="" class="dropdown-input-field qa-dropdown-input-field" placeholder="Search branches and tags" autocomplete="off" /><i aria-hidden="true" data-hidden="true" class="fa fa-search dropdown-input-search"></i><i aria-hidden="true" data-hidden="true" role="button" class="fa fa-times dropdown-input-clear js-dropdown-input-clear"></i></div>
<div class="dropdown-content"></div>
<div class="dropdown-loading"><i aria-hidden="true" data-hidden="true" class="fa fa-spinner fa-spin"></i></div>
</div>
</div>
</div>
</form>
</div>
<ul class="breadcrumb repo-breadcrumb">
<li class="breadcrumb-item">
<a href="/aple/entwicklung/ari/-/tree/4a11a582c417ca66ba15f3d2990265bd85cf69f8">ari
</a></li>
<li class="breadcrumb-item">
<a href="/aple/entwicklung/ari/-/tree/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd">amd</a>
</li>
<li class="breadcrumb-item">
<a href="/aple/entwicklung/ari/-/tree/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc">tsc</a>
</li>
<li class="breadcrumb-item">
<a href="/aple/entwicklung/ari/-/blob/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc/core_indexeddb.ts"><strong>core_indexeddb.ts</strong>
</a></li>
</ul>
</div>
<div class="tree-controls gl-children-ml-sm-3"><a class="btn shortcuts-find-file" rel="nofollow" href="/aple/entwicklung/ari/-/find_file/4a11a582c417ca66ba15f3d2990265bd85cf69f8">Find file
</a><a class="btn js-blob-blame-link" href="/aple/entwicklung/ari/-/blame/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc/core_indexeddb.ts">Blame</a><a class="btn" href="/aple/entwicklung/ari/-/commits/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc/core_indexeddb.ts">History</a><a class="btn js-data-file-blob-permalink-url" href="/aple/entwicklung/ari/-/blob/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc/core_indexeddb.ts">Permalink</a></div>
</div>

<div class="info-well d-none d-sm-block">
<div class="well-segment">
<ul class="blob-commit-info">
<li class="commit flex-row js-toggle-container" id="commit-250afc51">
<div class="avatar-cell d-none d-sm-block">
<a href="/MarcBurchart"><img alt="Marc Burchart&#39;s avatar" src="/uploads/-/system/user/avatar/84/avatar.png?width=40" class="avatar s40 d-none d-sm-inline-block" title="Marc Burchart" /></a>
</div>
<div class="commit-detail flex-list">
<div class="commit-content qa-commit-content">
<a class="commit-row-message item-title js-onboarding-commit-item " href="/aple/entwicklung/ari/-/commit/250afc5191845e34d1804409c1f851c1e1ccbf53">created core_indexeddb.ts</a>
<span class="commit-row-message d-inline d-sm-none">
&middot;
250afc51
</span>
<div class="committer">
<a class="commit-author-link js-user-link" data-user-id="84" href="/MarcBurchart">Marc Burchart</a> authored <time class="js-timeago" title="Aug 28, 2020 7:31pm" datetime="2020-08-28T19:31:14Z" data-toggle="tooltip" data-placement="bottom" data-container="body">Aug 28, 2020</time>
</div>

</div>
<div class="commit-actions flex-row">
<button class="btn gpg-status-box js-loading-gpg-badge" data-commit-sha="250afc5191845e34d1804409c1f851c1e1ccbf53" data-placement="top" data-title="GPG signature (loading...)" data-toggle="tooltip" tabindex="0"></button>

<div class="js-commit-pipeline-status" data-endpoint="/aple/entwicklung/ari/-/commit/250afc5191845e34d1804409c1f851c1e1ccbf53/pipelines?ref=4a11a582c417ca66ba15f3d2990265bd85cf69f8"></div>
<div class="commit-sha-group d-none d-sm-flex">
<div class="label label-monospace monospace">
250afc51
</div>
<button class="btn btn btn-default" data-toggle="tooltip" data-placement="bottom" data-container="body" data-title="Copy commit SHA" data-class="btn btn-default" data-clipboard-text="250afc5191845e34d1804409c1f851c1e1ccbf53" type="button" title="Copy commit SHA" aria-label="Copy commit SHA"><svg class="s16" data-testid="copy-to-clipboard-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#copy-to-clipboard"></use></svg></button>

</div>
</div>
</div>
</li>

</ul>
</div>


</div>
<div class="blob-content-holder" id="blob-content-holder">
<article class="file-holder">
<div class="js-file-title file-title-flex-parent">
<div class="file-header-content">
<i aria-hidden="true" data-hidden="true" class="fa fa-file-text-o fa-fw"></i>
<strong class="file-title-name">
core_indexeddb.ts
</strong>
<button class="btn btn-clipboard btn-transparent" data-toggle="tooltip" data-placement="bottom" data-container="body" data-class="btn-clipboard btn-transparent" data-title="Copy file path" data-clipboard-text="{&quot;text&quot;:&quot;amd/tsc/core_indexeddb.ts&quot;,&quot;gfm&quot;:&quot;`amd/tsc/core_indexeddb.ts`&quot;}" type="button" title="Copy file path" aria-label="Copy file path"><svg class="s16" data-testid="copy-to-clipboard-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#copy-to-clipboard"></use></svg></button>
<small class="mr-1">
5.41 KB
</small>
</div>

<div class="file-actions"><button name="button" type="submit" class="btn btn-primary js-edit-blob ml-2  disabled has-tooltip" title="You can only edit files when you are on a branch" data-container="body">Edit</button><button name="button" type="submit" class="btn btn-primary ide-edit-button ml-2 btn-inverted disabled has-tooltip" title="You can only edit files when you are on a branch" data-container="body">Web IDE</button><div class="btn-group ml-2" role="group">

<button name="button" type="submit" class="btn btn-default disabled has-tooltip" title="You can only replace files when you are on a branch" data-container="body">Replace</button>
<button name="button" type="submit" class="btn btn-default disabled has-tooltip" title="You can only delete files when you are on a branch" data-container="body">Delete</button>
</div><div class="btn-group ml-2" role="group">
<button class="btn btn btn-sm js-copy-blob-source-btn" data-toggle="tooltip" data-placement="bottom" data-container="body" data-class="btn btn-sm js-copy-blob-source-btn" data-title="Copy file contents" data-clipboard-target=".blob-content[data-blob-id=&#39;d3e5cde884dcdfec0b6b2b0e73b8676856ead7f9&#39;]" type="button" title="Copy file contents" aria-label="Copy file contents"><svg class="s16" data-testid="copy-to-clipboard-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#copy-to-clipboard"></use></svg></button>
<a class="btn btn-sm has-tooltip" target="_blank" rel="noopener noreferrer" aria-label="Open raw" title="Open raw" data-container="body" href="/aple/entwicklung/ari/-/raw/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc/core_indexeddb.ts"><svg class="s16" data-testid="doc-code-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#doc-code"></use></svg></a>
<a download="amd/tsc/core_indexeddb.ts" class="btn btn-sm has-tooltip" target="_blank" rel="noopener noreferrer" aria-label="Download" title="Download" data-container="body" href="/aple/entwicklung/ari/-/raw/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc/core_indexeddb.ts?inline=false"><svg class="s16" data-testid="download-icon"><use xlink:href="/assets/icons-81bca028cfa382a852fa2c8a6dfb4fb2b7467093d38f9fe9a07a519ca785299c.svg#download"></use></svg></a>

</div></div>
</div>
<div class="js-file-fork-suggestion-section file-fork-suggestion hidden">
<span class="file-fork-suggestion-note">
You're not allowed to
<span class="js-file-fork-suggestion-section-action">
edit
</span>
files in this project directly. Please fork this project,
make your changes there, and submit a merge request.
</span>
<a class="js-fork-suggestion-button btn btn-grouped btn-inverted btn-success" rel="nofollow" data-method="post" href="/aple/entwicklung/ari/-/blob/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc/core_indexeddb.ts">Fork</a>
<button class="js-cancel-fork-suggestion-button btn btn-grouped" type="button">
Cancel
</button>
</div>



<div class="blob-viewer" data-path="amd/tsc/core_indexeddb.ts" data-type="simple" data-url="/aple/entwicklung/ari/-/blob/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc/core_indexeddb.ts?format=json&amp;viewer=simple">
<div class="text-center gl-mt-3 gl-mb-3">
<i aria-hidden="true" aria-label="Loading content…" class="fa fa-spinner fa-spin fa-2x qa-spinner"></i>
</div>

</div>


</article>
</div>

<div class="modal" id="modal-upload-blob">
<div class="modal-dialog modal-lg">
<div class="modal-content">
<div class="modal-header">
<h3 class="page-title">Replace core_indexeddb.ts</h3>
<button aria-label="Close" class="close" data-dismiss="modal" type="button">
<span aria-hidden>&times;</span>
</button>
</div>
<div class="modal-body">
<form class="js-quick-submit js-upload-blob-form" data-method="put" action="/aple/entwicklung/ari/-/update/4a11a582c417ca66ba15f3d2990265bd85cf69f8/amd/tsc/core_indexeddb.ts" accept-charset="UTF-8" method="post"><input name="utf8" type="hidden" value="&#x2713;" /><input type="hidden" name="_method" value="put" /><input type="hidden" name="authenticity_token" value="xlgmPTxpLxqCiO85H3KMWkcwI/DvmYaFpIYydj5BrS23bnrLZMhjjJ1Z3PPVH1LU+B0toYYhcoHXbBplxSqPEA==" /><div class="dropzone">
<div class="dropzone-previews blob-upload-dropzone-previews">
<p class="dz-message light">
Attach a file by drag &amp; drop or <a class="markdown-selector" href="#">click to upload</a>
</p>
</div>
</div>
<br>
<div class="dropzone-alerts alert alert-danger data" style="display:none"></div>
<div class="form-group row commit_message-group">
<label class="col-form-label col-sm-2" for="commit_message-8d7976c99027833a56b8b51335b6b6ee">Commit message
</label><div class="col-sm-10">
<div class="commit-message-container">
<div class="max-width-marker"></div>
<textarea name="commit_message" id="commit_message-8d7976c99027833a56b8b51335b6b6ee" class="form-control js-commit-message" placeholder="Replace core_indexeddb.ts" required="required" rows="3">
Replace core_indexeddb.ts</textarea>
</div>
</div>
</div>

<div class="form-group row branch">
<label class="col-form-label col-sm-2" for="branch_name">Target Branch</label>
<div class="col-sm-10">
<input type="text" name="branch_name" id="branch_name" required="required" class="form-control js-branch-name ref-name" />
<div class="js-create-merge-request-container">
<div class="form-check gl-mt-3">
<input type="checkbox" name="create_merge_request" id="create_merge_request-09fa6a332acc5b89e183f936efabdd1b" value="1" class="js-create-merge-request form-check-input" checked="checked" />
<label class="form-check-label" for="create_merge_request-09fa6a332acc5b89e183f936efabdd1b">Start a <strong>new merge request</strong> with these changes
</label></div>

</div>
</div>
</div>
<input type="hidden" name="original_branch" id="original_branch" value="4a11a582c417ca66ba15f3d2990265bd85cf69f8" class="js-original-branch" />

<div class="form-actions">
<button name="button" type="button" class="btn btn-success btn-upload-file" id="submit-all"><i aria-hidden="true" data-hidden="true" class="fa fa-spin fa-spinner js-loading-icon hidden"></i>
Replace file
</button><a class="btn btn-cancel" data-dismiss="modal" href="#">Cancel</a>

</div>
</form></div>
</div>
</div>
</div>

</div>


</div>
</div>
</div>
</div>


<script>
//<![CDATA[
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img.lazy').forEach(img => {
    img.loading = 'lazy';
    let imgUrl = img.dataset.src;
    // Only adding width + height for avatars for now
    if (imgUrl.indexOf('/avatar/') > -1 && imgUrl.indexOf('?') === -1) {
      const targetWidth = img.getAttribute('width') || img.width;
      imgUrl += `?width=${targetWidth}`;
    }
    img.src = imgUrl;
    img.removeAttribute('data-src');
    img.classList.remove('lazy');
    img.classList.add('js-lazy-loaded', 'qa-js-lazy-loaded');
  });
}

//]]>
</script>

</body>
</html>

