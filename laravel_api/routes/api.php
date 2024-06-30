<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Announce;
use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\EventRegisterController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\FreedomWallController;
use App\Http\Controllers\MembersController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\StudentsController;
use App\Http\Controllers\EmailVerificationController;

use App\Http\Controllers\PasswordResetController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

//Login Signup Page Controllers
Route::post('/register', [StudentsController::class, 'register'])
  ->name('api.register');

Route::post('/login', [StudentsController::class, 'login'])->name('api.login');

Route::post('/verify', [EmailVerificationController::class, 'verify']);

//Announcement Page Controllers
Route::get('/announcements', [Announce::class, 'getAnnouncements']);
Route::post('/announcements', [Announce::class, 'createAnnouncement']);
Route::put('/announcements/{announcement}', [Announce::class, 
  'updateAnnouncement']);
Route::delete('/announcements/{announcement}', [Announce::class, 
  'deleteAnnouncement']);
                       
//Homepage Controllers
//User Data
Route::get('/retrieve/{id}&{email}', 
  [StudentsController::class, 'retrieve']);

//Update Icon
Route::put('students/update-icon', [StudentsController::class, 'updateIcon']);

//Update Info
Route::put('/update-student-info', [StudentsController::class, 'updateUserInfo'])
   ->name('api.updateUserInfo');

  //Update password
Route::put('/change-password', [StudentsController::class, 'changePassword'])
  ->name('api.changePassword');    

Route::post('/registerEvent', [EventRegisterController::class, 'registerEvent'])
  ->name('api.registerEvent');

Route::get('/getTotalMembers', [StudentsController::class, 'getTotalMembers'])
  ->name('api.getTotalMembers'); 

Route::get('/getTotalUpcomingEvents', [EventsController::class, 
  'getTotalUpcomingEvents'])->name('api.getTotalUpcomingEvents');

Route::get('/getTotalPendingPosts', [FreedomWallController::class, 
  'getTotalPendingPosts'])->name('api.getTotalUpcomingEvents');

Route::get('/getFiveEvents', [EventsController::class, 'getFiveEvents'])
  ->name('api.getFiveEvents');

//Homepage Event Registration Controllers
Route::post('/checkRegistration', [EventRegisterController::class, 
  'checkRegistration'])->name('api.checkRegistration');

Route::post('/unregisterEvent', [EventRegisterController::class, 
  'unregisterEvent'])->name('api.unregisterEvent');

Route::post('/reRegisterEvent', [EventRegisterController::class, 
  'reRegisterEvent'])->name('api.reRegisterEvent');

Route::get('/getRegisteredMembers/{event_id}', [EventRegisterController::class, 
  'getRegisteredMembers'])->name('api.getRegisteredMembers');

//Members Page Controllers
Route::get('/members', [MembersController::class, 'getMembers'])
  ->name('api.getMembers');

Route::get('/request', [MembersController::class, 'membershipRequest'])
  ->name('api.membershipRequest');
                    
Route::post('/acceptMember', [MembersController::class, 'acceptMember'])
  ->name('api.acceptMember');
                
Route::post('/declineMember', [MembersController::class, 'declineMember'])
  ->name('api.declineMember');

Route::get('/getOfficers', [MembersController::class, 'getOfficers'])
  ->name('api.getOfficers');

Route::post('/promoteToOfficer', [MembersController::class, 'promoteToOfficer'])
  ->name('api.promoteToOfficer');

Route::post('/demoteToMember', [MembersController::class, 'demoteToMember'])
  ->name('api.demoteToMember');

Route::get('/member/search_member', [SearchController::class, 'searchMember'])
  ->name('api.searchMember');

//Freedom Wall Page Controllers
Route::get('/getPosts', [FreedomWallController::class, 'getPosts'])
  ->name('api.getPosts');     

Route::post('/createPostFW', [FreedomWallController::class, 'createPostFW'])
  ->name('api.createPostFW');

Route::post('/deletePost', [FreedomWallController::class, 'deletePost'])
  ->name('api.deletePost');

Route::get('/getPostRequest', [FreedomWallController::class, 'getPostRequest'])
  ->name('api.getPostRequest'); 

Route::post('/acceptPost', [FreedomWallController::class, 'acceptPost'])
  ->name('api.acceptPost'); 

Route::post('/declinePost', [FreedomWallController::class, 'declinePost'])
  ->name('api.declinePost'); 

Route::get('/getDeletionRequests', [FreedomWallController::class, 
  'getDeletionRequests'])->name('api.getDeletionRequests'); 

Route::post('/deletionRequest', [FreedomWallController::class, 'deletionRequest'])
  ->name('api.deletionRequest'); 

Route::post('/declineDeletionRequest', [FreedomWallController::class, 
  'declineDeletionRequest'])->name('api.declineDeletionRequest'); 
Route::post('/createEvent', [EventsController::class, 'createEvent'])
  ->name('api.createEvent');

//Events Page Controllers
Route::get('/getUpcomingEvents', [EventsController::class, 'getUpcomingEvents'])
  ->name('api.getUpcomingEvents');

Route::get('/getDraftEvents', [EventsController::class, 'getDraftEvents'])
  ->name('api.getDraftEvents');

Route::get('/getOccuringEvents', [EventsController::class, 'getOccuringEvents'])
   ->name('api.getOccuringEvents');

Route::post('/markAsOccuring', [EventsController::class, 'markAsOccuring'])
  ->name('api.markAsOccuring');

Route::post('/publishDraft', [EventsController::class, 'publishDraft'])
  ->name('api.publishDraft');

Route::post('/markAsComplete', [EventsController::class, 'markAsComplete'])
  ->name('api.markAsComplete');

Route::post('/cancelEvent', [EventsController::class, 'cancelEvent'])
  ->name('api.cancelEvent');

Route::post('/updateEvent', [EventsController::class, 'updateEvent'])
  ->name('api.updateEvent');

//Archive Page Controller
Route::get('/getYearlyEvents', [ArchiveController::class, 'getYearlyEvents'])
  ->name('api.getYearlyEvents');

Route::get('/getOldEvents', [ArchiveController::class, 'getOldEvents'])
  ->name('api.getOldEvents');

Route::get('/archive/search_archive', [SearchController::class, 'searchArchive'])
  ->name('api.searchArchive');

//Forgot password Controllers
Route::post('auth/send-reset-link', [PasswordResetController::class, 
  'sendResetLinkEmail']);
Route::post('auth/verify-code', [PasswordResetController::class, 
  'verifyToken']);
Route::post('auth/reset-password', [PasswordResetController::class, 
  'reset']);

// Deactivate users
Route::post('users/deactivate/{id}', [StudentsController::class, 'deactivateUser']);
