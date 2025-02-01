// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Blog {
    string public name;
    address public owner;

    using Counters for Counters.Counter;
    Counters.Counter private _postIds;

    struct Post {
        uint id;
        string title;
        string content;
        bool isPublished;
    }

    mapping(uint => Post) idToPost;
    mapping(string => Post) hashToPost;

    event PostCreated(uint id, string title, string content);
    event PostUpdated(uint id, string title, string content, bool isPublished);

    constructor(string memory _name) {
        name = _name;
        owner = msg.sender;
    }

    function updateName(string memory _name) public {
        name = _name;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function fetchPost(string memory _hash) public view returns (Post memory) {
        return hashToPost[_hash];
    }

    function createPost(string memory _title, string memory _hash) public {
        _postIds.increment();
        uint postId = _postIds.current();
        Post storage post = idToPost[postId];
        post.id = postId;
        post.title = _title;
        post.content = _hash;
        post.isPublished = true;
        hashToPost[_title] = post;
        emit PostCreated(postId, _title, _hash);
    }

    function updatePost(
        uint _id,
        string memory _title,
        string memory _hash,
        bool _isPublished
    ) public onlyOwner {
        Post storage post = idToPost[_id];
        post.title = _title;
        post.content = _hash;
        post.isPublished = _isPublished;
        idToPost[_id] = post;
        hashToPost[_hash] = post;
        emit PostUpdated(_id, _title, _hash, _isPublished);
    }

    function fetchPosts() public view returns (Post[] memory) {
        uint itemCount = _postIds.current();

        Post[] memory posts = new Post[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            uint currentId = i + 1;
            Post storage currentItem = idToPost[currentId];
            posts[i] = currentItem;
        }
        return posts;
    }
}
