<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Announce;
use App\Http\Controllers\PasswordResetController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

//Register
Route::post('/register', [\App\Http\Controllers\StudentsController::class, 
                                'register'])->name('api.register');

//Login
Route::post('/login', [\App\Http\Controllers\StudentsController::class, 
                                'login'])->name('api.login');

//Announcement CRUD
Route::get('/announcements', [Announce::class, 'getAnnouncements']);
Route::post('/announcements', [Announce::class, 'createAnnouncement']);
Route::put('/announcements/{announcement}', [Announce::class, 'updateAnnouncement']);
Route::delete('/announcements/{announcement}', [Announce::class, 'deleteAnnouncement']);
                       
//User Data
Route::middleware('jwt.auth')->get('/retrieve/{id}&{email}', [\App\Http\Controllers\StudentsController::class, 'retrieve']);

//Update Icon
Route::put('students/update-icon', [\App\Http\Controllers\StudentsController::class, 'updateIcon']);

//Members
Route::get('/members', [\App\Http\Controllers\MembersController::class, 
                                'getMembers'])->name('api.getMembers');

//Member Requests
Route::get('/request', [\App\Http\Controllers\MembersController::class, 
                        'membershipRequest'])->name('api.membershipRequest');

//Accept Member Request                        
Route::post('/acceptMember', [\App\Http\Controllers\MembersController::class, 
                                'acceptMember'])->name('api.acceptMember');

//Decline Member Request                        
Route::post('/declineMember', [\App\Http\Controllers\MembersController::class, 
                                'declineMember'])->name('api.declineMember');

//Get officers
Route::get('/getOfficers', [\App\Http\Controllers\MembersController::class, 
                        'getOfficers'])->name('api.getOfficers');

//Add to officer
Route::post('/promoteToOfficer', [\App\Http\Controllers\MembersController::class, 
                            'promoteToOfficer'])->name('api.promoteToOfficer');

//Add to officer
Route::post('/demoteToMember', [\App\Http\Controllers\MembersController::class, 
                            'demoteToMember'])->name('api.demoteToMember');

Route::get('/getPosts', [\App\Http\Controllers\FreedomWallController::class, 
                                'getPosts'])->name('api.getPosts');     

Route::post('/createPostFW', 
        [\App\Http\Controllers\FreedomWallController::class, 'createPostFW'])
            ->name('api.createPostFW');

Route::post('/deletePost', 
        [\App\Http\Controllers\FreedomWallController::class, 'deletePost'])
            ->name('api.deletePost');

Route::post('/createEvent', 
        [\App\Http\Controllers\EventsController::class, 'createEvent'])
            ->name('api.createEvent');

Route::get('/getUpcomingEvents', 
        [\App\Http\Controllers\EventsController::class, 'getUpcomingEvents'])
            ->name('api.getUpcomingEvents');

Route::get('/getDraftEvents', 
        [\App\Http\Controllers\EventsController::class, 'getDraftEvents'])
            ->name('api.getDraftEvents');

Route::get('/getOccuringEvents', 
        [\App\Http\Controllers\EventsController::class, 'getOccuringEvents'])
            ->name('api.getOccuringEvents');

Route::post('/markAsOccuring', 
        [\App\Http\Controllers\EventsController::class, 'markAsOccuring'])
            ->name('api.markAsOccuring');

Route::post('/publishDraft', 
        [\App\Http\Controllers\EventsController::class, 'publishDraft'])
            ->name('api.publishDraft');

Route::post('/markAsComplete', 
        [\App\Http\Controllers\EventsController::class, 'markAsComplete'])
            ->name('api.markAsComplete');

Route::post('/cancelEvent', 
        [\App\Http\Controllers\EventsController::class, 'cancelEvent'])
            ->name('api.cancelEvent');

Route::post('/updateEvent', 
        [\App\Http\Controllers\EventsController::class, 'updateEvent'])
            ->name('api.updateEvent');

Route::get('/getYearlyEvents', 
        [\App\Http\Controllers\ArchiveController::class, 'getYearlyEvents'])
            ->name('api.getYearlyEvents');

Route::get('/getOldEvents', 
        [\App\Http\Controllers\ArchiveController::class, 'getOldEvents'])
            ->name('api.getOldEvents');


Route::post('auth/send-reset-link', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('auth/verify-code', [PasswordResetController::class, 'verifyToken']);
Route::post('auth/reset-password', [PasswordResetController::class, 'reset']);

Route::get('/archive/search_archive', [\App\Http\Controllers\SearchController::class, 
                                'searchArchive'])->name('api.searchArchive');

Route::get('/member/search_member', [\App\Http\Controllers\SearchController::class, 
                                'searchMember'])->name('api.searchMember');

Route::post('/registerEvent', 
        [\App\Http\Controllers\EventRegisterController::class, 'registerEvent'])
            ->name('api.registerEvent');

Route::post('/checkRegistration', 
        [\App\Http\Controllers\EventRegisterController::class, 'checkRegistration'])
            ->name('api.checkRegistration');

Route::post('/unregisterEvent', 
        [\App\Http\Controllers\EventRegisterController::class, 'unregisterEvent'])
            ->name('api.unregisterEvent');

Route::post('/reRegisterEvent', 
        [\App\Http\Controllers\EventRegisterController::class, 'reRegisterEvent'])
            ->name('api.reRegisterEvent');

Route::get('/getPostRequest', [\App\Http\Controllers\FreedomWallController::class, 
                                'getPostRequest'])->name('api.getPostRequest'); 

Route::post('/acceptPost', [\App\Http\Controllers\FreedomWallController::class, 
                                'acceptPost'])->name('api.acceptPost'); 

Route::post('/declinePost', [\App\Http\Controllers\FreedomWallController::class, 
                                'declinePost'])->name('api.declinePost'); 

Route::get('/getDeletionRequests', [\App\Http\Controllers\FreedomWallController::class, 
                                'getDeletionRequests'])->name('api.getDeletionRequests'); 

Route::post('/deletionRequest', [\App\Http\Controllers\FreedomWallController::class, 
                                'deletionRequest'])->name('api.deletionRequest'); 

Route::post('/declineDeletionRequest', [\App\Http\Controllers\FreedomWallController::class, 
                                'declineDeletionRequest'])->name('api.declineDeletionRequest'); 

